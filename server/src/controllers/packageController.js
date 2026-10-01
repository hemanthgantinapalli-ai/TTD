import Package from '../models/Package.js';
import { logAdminAction } from '../services/auditService.js';

// Public Endpoints
export const getPublicPackages = async (req, res, next) => {
  try {
    const { duration, category, sort } = req.query;
    const filter = { isDeleted: false, status: 'active' };

    if (duration === '1-day') filter.duration = { $regex: '1 Day', $options: 'i' };
    else if (duration === '2-day') filter.duration = { $regex: '2 Day', $options: 'i' };
    else if (duration === 'elder') filter.category = { $regex: 'special', $options: 'i' };

    if (category) filter.category = category;

    let query = Package.find(filter);
    if (sort === 'price-low') query = query.sort({ startingPrice: 1 });
    else if (sort === 'price-high') query = query.sort({ startingPrice: -1 });
    else query = query.sort({ featured: -1, createdAt: -1 });

    const packages = await query.lean();
    return res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    next(error);
  }
};

export const getPublicPackageBySlug = async (req, res, next) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, isDeleted: false }).lean();
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    return res.json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
};

// Admin Endpoints
export const adminGetAllPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    next(error);
  }
};

export const adminGetPackageById = async (req, res, next) => {
  try {
    const isObjId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = {
      isDeleted: false,
      $or: [{ slug: req.params.id }, ...(isObjId ? [{ _id: req.params.id }] : [])]
    };
    const pkg = await Package.findOne(filter).lean();
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    return res.json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
};

export const adminCreatePackage = async (req, res, next) => {
  try {
    const slug = req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const pkg = await Package.create({
      ...req.body,
      slug,
      status: req.body.status || 'active',
    });

    await logAdminAction({
      adminUser: req.user,
      action: 'CREATE_PACKAGE',
      resource: 'Package',
      resourceId: pkg._id,
      description: `Created package: ${pkg.title}`,
    });

    return res.status(201).json({ success: true, message: 'Package created successfully', data: pkg });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Package slug or title already exists' });
    }
    next(error);
  }
};

export const adminUpdatePackage = async (req, res, next) => {
  try {
    const isObjId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = {
      isDeleted: false,
      $or: [{ slug: req.params.id }, ...(isObjId ? [{ _id: req.params.id }] : [])]
    };
    const pkg = await Package.findOneAndUpdate(
      filter,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'UPDATE_PACKAGE',
      resource: 'Package',
      resourceId: pkg._id,
      description: `Updated package: ${pkg.title}`,
    });

    return res.json({ success: true, message: 'Package updated successfully', data: pkg });
  } catch (error) {
    next(error);
  }
};

export const adminDeletePackage = async (req, res, next) => {
  try {
    const isObjId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const filter = {
      isDeleted: false,
      $or: [{ slug: req.params.id }, ...(isObjId ? [{ _id: req.params.id }] : [])]
    };
    const pkg = await Package.findOneAndUpdate(
      filter,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'DELETE_PACKAGE',
      resource: 'Package',
      resourceId: pkg._id,
      description: `Archived package: ${pkg.title}`,
    });

    return res.json({ success: true, message: 'Package removed successfully' });
  } catch (error) {
    next(error);
  }
};
