import Hotel from '../models/Hotel.js';
import { logAdminAction } from '../services/auditService.js';

// Public Endpoints
export const getPublicHotels = async (req, res, next) => {
  try {
    const { vegOnly, sort } = req.query;
    const filter = { isDeleted: false, status: 'active' };

    if (vegOnly === 'true') filter.vegOnly = true;

    let query = Hotel.find(filter);
    if (sort === 'price-low') query = query.sort({ pricePerNight: 1 });
    else if (sort === 'price-high') query = query.sort({ pricePerNight: -1 });
    else query = query.sort({ featured: -1, starRating: -1 });

    const hotels = await query.lean();
    return res.json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    next(error);
  }
};

export const getPublicHotelBySlug = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug, isDeleted: false }).lean();
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    return res.json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
};

// Admin Endpoints
export const adminGetAllHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    next(error);
  }
};

export const adminGetHotelById = async (req, res, next) => {
  try {
    const isObjId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = {
      isDeleted: false,
      $or: [{ slug: req.params.id }, ...(isObjId ? [{ _id: req.params.id }] : [])]
    };
    const hotel = await Hotel.findOne(filter).lean();
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    return res.json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
};

export const adminCreateHotel = async (req, res, next) => {
  try {
    const slug = req.body.slug || req.body.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const hotel = await Hotel.create({
      ...req.body,
      slug,
      status: req.body.status || 'active',
    });

    await logAdminAction({
      adminUser: req.user,
      action: 'CREATE_HOTEL',
      resource: 'Hotel',
      resourceId: hotel._id,
      description: `Created hotel: ${hotel.name}`,
    });

    return res.status(201).json({ success: true, message: 'Hotel created successfully', data: hotel });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Hotel slug or name already exists' });
    }
    next(error);
  }
};

export const adminUpdateHotel = async (req, res, next) => {
  try {
    const isObjId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = {
      isDeleted: false,
      $or: [{ slug: req.params.id }, ...(isObjId ? [{ _id: req.params.id }] : [])]
    };
    const hotel = await Hotel.findOneAndUpdate(
      filter,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'UPDATE_HOTEL',
      resource: 'Hotel',
      resourceId: hotel._id,
      description: `Updated hotel: ${hotel.name}`,
    });

    return res.json({ success: true, message: 'Hotel updated successfully', data: hotel });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteHotel = async (req, res, next) => {
  try {
    const isObjId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = {
      isDeleted: false,
      $or: [{ slug: req.params.id }, ...(isObjId ? [{ _id: req.params.id }] : [])]
    };
    const hotel = await Hotel.findOneAndUpdate(
      filter,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'DELETE_HOTEL',
      resource: 'Hotel',
      resourceId: hotel._id,
      description: `Archived hotel: ${hotel.name}`,
    });

    return res.json({ success: true, message: 'Hotel removed successfully' });
  } catch (error) {
    next(error);
  }
};
