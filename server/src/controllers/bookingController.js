import Booking from '../models/Booking.js';
import { logAdminAction } from '../services/auditService.js';

// Public/User Booking Creation
export const createBooking = async (req, res, next) => {
  try {
    const {
      type = 'package',
      itemName,
      travelDate,
      date,
      returnDate,
      travellers = 1,
      amount,
      customerDetails = {},
      leadPilgrim = {},
      paymentMethod = 'UPI',
      notes = '',
    } = req.body;

    const finalTravelDate = travelDate || date || new Date().toISOString().split('T')[0];
    const finalCustomer = (customerDetails && customerDetails.name) ? customerDetails : leadPilgrim;

    if (!itemName || !finalTravelDate || !amount || !finalCustomer.name || !finalCustomer.phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking details (itemName, date, amount, customer name & phone)' });
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const pnr = `TTY-${new Date().getFullYear()}-${randomSuffix}`;
    const bookingId = `bk_${Date.now()}`;

    const booking = await Booking.create({
      bookingId,
      pnr,
      user: req.user?._id || null,
      type,
      itemName,
      travelDate: new Date(finalTravelDate),
      returnDate: returnDate ? new Date(returnDate) : null,
      travellers: Number(travellers) || 1,
      amount: Number(amount),
      customerDetails: {
        name: finalCustomer.name,
        phone: finalCustomer.phone,
        email: finalCustomer.email || '',
        city: finalCustomer.city || 'India',
      },
      leadPilgrim: {
        name: finalCustomer.name,
        phone: finalCustomer.phone,
        email: finalCustomer.email || '',
        city: finalCustomer.city || 'India',
      },
      paymentMethod,
      paymentStatus: 'paid', // Initial confirmation on checkout
      bookingStatus: 'confirmed',
      notes,
    });

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const filter = { isDeleted: false };
    if (req.user) {
      filter.$or = [{ user: req.user._id }, { 'customerDetails.email': req.user.email }];
    }
    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// Admin Booking Endpoints
export const adminGetAllBookings = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    const filter = { isDeleted: false };

    if (status) filter.bookingStatus = status.toLowerCase();
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { pnr: { $regex: search, $options: 'i' } },
        { itemName: { $regex: search, $options: 'i' } },
        { 'customerDetails.name': { $regex: search, $options: 'i' } },
        { 'customerDetails.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();

    const formatted = bookings.map(b => ({
      ...b,
      date: b.travelDate ? new Date(b.travelDate).toISOString().split('T')[0] : '',
      status: b.bookingStatus ? (b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1)) : 'Confirmed',
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const adminGetBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
      isDeleted: false,
    }).lean();

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes, paymentStatus } = req.body;
    const update = {};
    if (status) update.bookingStatus = status.toLowerCase();
    if (paymentStatus) update.paymentStatus = paymentStatus.toLowerCase();
    if (notes) update.internalNotes = notes;

    const booking = await Booking.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { bookingId: req.params.id }], isDeleted: false },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'UPDATE_BOOKING_STATUS',
      resource: 'Booking',
      resourceId: booking.pnr,
      description: `Updated booking ${booking.pnr} status to ${status || booking.bookingStatus}`,
    });

    return res.json({ success: true, message: 'Booking updated successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { bookingId: req.params.id }], isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'DELETE_BOOKING',
      resource: 'Booking',
      resourceId: booking.pnr,
      description: `Archived booking ${booking.pnr}`,
    });

    return res.json({ success: true, message: 'Booking archived successfully' });
  } catch (error) {
    next(error);
  }
};
