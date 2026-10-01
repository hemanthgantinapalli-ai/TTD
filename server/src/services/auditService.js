import AdminAuditLog from '../models/AdminAuditLog.js';

export const logAdminAction = async ({
  adminUser = null,
  adminEmail = '',
  action,
  resource,
  resourceId = '',
  description = '',
  metadata = {},
}) => {
  try {
    await AdminAuditLog.create({
      adminUser: adminUser?._id || adminUser?.id || null,
      adminEmail: adminEmail || adminUser?.email || 'admin@ttdyatra.com',
      action,
      resource,
      resourceId: String(resourceId || ''),
      description,
      metadata,
      timestamp: new Date(),
    });
  } catch (err) {
    console.warn('[AuditLog] Failed to record audit log:', err.message);
  }
};
