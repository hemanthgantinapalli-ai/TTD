import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['booking_payment', 'booking_new', 'booking_status', 'lead_new', 'system_alert'],
    default: 'booking_new',
    index: true,
  },
  category: {
    type: String,
    enum: ['Payments', 'Bookings', 'Inquiries', 'Alerts'],
    default: 'Bookings',
    index: true,
  },
  priority: {
    type: String,
    enum: ['urgent', 'high', 'normal', 'info'],
    default: 'normal',
  },
  metadata: {
    bookingId: { type: String, default: null },
    pnr: { type: String, default: null },
    amount: { type: Number, default: 0 },
    customerName: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    paymentMethod: { type: String, default: '' },
    itemName: { type: String, default: '' },
  },
  link: {
    type: String,
    default: '/admin/bookings',
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: {
    type: Date,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

notificationSchema.index({ createdAt: -1, read: 1, isDeleted: 1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
