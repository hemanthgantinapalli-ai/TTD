import mongoose from 'mongoose';

const adminAuditLogSchema = new mongoose.Schema({
  adminUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  adminEmail: { type: String, trim: true, default: '' },
  action: { type: String, required: true, index: true },
  resource: { type: String, required: true, index: true },
  resourceId: { type: String, default: '' },
  description: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true },
}, {
  timestamps: true,
});

adminAuditLogSchema.index({ timestamp: -1, action: 1 });

export default mongoose.models.AdminAuditLog || mongoose.model('AdminAuditLog', adminAuditLogSchema);
