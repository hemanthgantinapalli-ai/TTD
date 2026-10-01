import Setting from '../models/Setting.js';
import { logAdminAction } from '../services/auditService.js';

export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find({ isPublic: true }).lean();
    const data = {};
    settings.forEach(s => { data[s.key] = s.value; });
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const adminGetSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find({}).lean();
    const data = {};
    settings.forEach(s => { data[s.key] = s.value; });
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateSettings = async (req, res, next) => {
  try {
    const body = req.body || {};
    for (const [key, value] of Object.entries(body)) {
      await Setting.findOneAndUpdate(
        { key },
        { $set: { value } },
        { upsert: true }
      );
    }

    await logAdminAction({
      adminUser: req.user,
      action: 'UPDATE_SETTINGS',
      resource: 'Setting',
      description: 'Updated platform settings',
      metadata: body,
    });

    const updated = await Setting.find({}).lean();
    const data = {};
    updated.forEach(s => { data[s.key] = s.value; });

    return res.json({ success: true, message: 'Settings saved to MongoDB successfully', data });
  } catch (error) {
    next(error);
  }
};
