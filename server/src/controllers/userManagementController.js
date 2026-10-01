import User from '../models/User.js';
import Booking from '../models/Booking.js';
import { logAdminAction } from '../services/auditService.js';

export const adminGetUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-passwordHash').sort({ createdAt: -1 }).lean();

    // Attach real booking counts from MongoDB Booking collection
    const usersWithBookings = await Promise.all(
      users.map(async (u) => {
        const bookingsCount = await Booking.countDocuments({
          isDeleted: false,
          $or: [{ user: u._id }, { 'customerDetails.email': u.email }],
        });
        return {
          ...u,
          bookingsCount,
          status: u.isActive ? 'Active' : 'Inactive',
        };
      })
    );

    return res.json({ success: true, count: usersWithBookings.length, data: usersWithBookings });
  } catch (error) {
    next(error);
  }
};

export const adminGetUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select('-passwordHash').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const bookings = await Booking.find({
      isDeleted: false,
      $or: [{ user: user._id }, { 'customerDetails.email': user.email }],
    }).lean();

    return res.json({ success: true, data: { user, bookings } });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateUser = async (req, res, next) => {
  try {
    const { role, isActive, name, phone } = req.body;
    const update = {};
    if (role) update.role = role;
    if (typeof isActive === 'boolean') update.isActive = isActive;
    if (name) update.name = name;
    if (phone) update.phone = phone;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: update },
      { returnDocument: 'after' }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'UPDATE_USER',
      resource: 'User',
      resourceId: user._id,
      description: `Updated user permissions for: ${user.email}`,
    });

    return res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'DELETE_USER',
      resource: 'User',
      resourceId: user._id,
      description: `Archived user: ${user.email}`,
    });

    return res.json({ success: true, message: 'User archived successfully' });
  } catch (error) {
    next(error);
  }
};
