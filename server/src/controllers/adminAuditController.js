import AdminAuditLog from '../models/AdminAuditLog.js';

export const adminGetAuditLogs = async (req, res, next) => {
  try {
    const logs = await AdminAuditLog.find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    return res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};
