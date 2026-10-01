import Vehicle from '../models/Vehicle.js';
import { logAdminAction } from '../services/auditService.js';

// Public Endpoints
export const getPublicVehicles = async (req, res, next) => {
  try {
    const { ac, sort } = req.query;
    const filter = { isDeleted: false, status: 'active' };

    if (ac === 'true') filter.ac = true;

    let query = Vehicle.find(filter);
    if (sort === 'price-low') query = query.sort({ pricePerDay: 1 });
    else if (sort === 'price-high') query = query.sort({ pricePerDay: -1 });
    else query = query.sort({ featured: -1, rating: -1 });

    // Exclude private driver contact on public site
    const vehicles = await query.select('-driverDetails.phone').lean();
    return res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    next(error);
  }
};

export const getPublicVehicleBySlug = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ slug: req.params.slug, isDeleted: false })
      .select('-driverDetails.phone')
      .lean();
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    return res.json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// Admin Endpoints
export const adminGetAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    next(error);
  }
};

export const adminGetVehicleById = async (req, res, next) => {
  try {
    const isObjId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = {
      isDeleted: false,
      $or: [{ slug: req.params.id }, ...(isObjId ? [{ _id: req.params.id }] : [])]
    };
    const vehicle = await Vehicle.findOne(filter).lean();
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    return res.json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

export const adminCreateVehicle = async (req, res, next) => {
  try {
    const slug = req.body.slug || req.body.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const vehicle = await Vehicle.create({
      ...req.body,
      slug,
      status: req.body.status || 'active',
    });

    await logAdminAction({
      adminUser: req.user,
      action: 'CREATE_VEHICLE',
      resource: 'Vehicle',
      resourceId: vehicle._id,
      description: `Created vehicle: ${vehicle.name}`,
    });

    return res.status(201).json({ success: true, message: 'Vehicle created successfully', data: vehicle });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Vehicle slug or registration already exists' });
    }
    next(error);
  }
};

export const adminUpdateVehicle = async (req, res, next) => {
  try {
    const isObjId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = {
      isDeleted: false,
      $or: [{ slug: req.params.id }, ...(isObjId ? [{ _id: req.params.id }] : [])]
    };
    const vehicle = await Vehicle.findOneAndUpdate(
      filter,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'UPDATE_VEHICLE',
      resource: 'Vehicle',
      resourceId: vehicle._id,
      description: `Updated vehicle: ${vehicle.name}`,
    });

    return res.json({ success: true, message: 'Vehicle updated successfully', data: vehicle });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteVehicle = async (req, res, next) => {
  try {
    const isObjId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = {
      isDeleted: false,
      $or: [{ slug: req.params.id }, ...(isObjId ? [{ _id: req.params.id }] : [])]
    };
    const vehicle = await Vehicle.findOneAndUpdate(
      filter,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'DELETE_VEHICLE',
      resource: 'Vehicle',
      resourceId: vehicle._id,
      description: `Archived vehicle: ${vehicle.name}`,
    });

    return res.json({ success: true, message: 'Vehicle removed successfully' });
  } catch (error) {
    next(error);
  }
};
