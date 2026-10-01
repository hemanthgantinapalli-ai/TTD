import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true,
  },
  bookingRef: {
    type: String,
    required: true,
    index: true, // PNR reference, e.g. TTY-2026-94812
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true, // e.g. ORD-2026-10492
  },
  gateway: {
    type: String,
    enum: ['manual_upi', 'razorpay', 'test'],
    default: 'manual_upi',
    index: true,
  },
  method: {
    type: String,
    enum: ['upi', 'card', 'netbanking'],
    default: 'upi',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'cancelled', 'refunded', 'verification_pending'],
    default: 'pending',
    index: true,
  },
  transactionId: {
    type: String,
    default: '',
    index: true,
  },
  utr: {
    type: String,
    default: '',
    index: true,
  },
  gatewayPaymentId: {
    type: String,
    default: '',
  },
  gatewayOrderId: {
    type: String,
    default: '',
  },
  gatewaySignature: {
    type: String,
    default: '',
  },
  failureReason: {
    type: String,
    default: '',
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verification_pending', 'verified', 'rejected'],
    default: 'pending',
    index: true,
  },
  customerDetails: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    city: { type: String, default: '' },
  },
  notes: {
    type: String,
    default: '',
  },
  submittedAt: {
    type: Date,
    default: null,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  paidAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(_document, result) {
      delete result.__v;
      return result;
    }
  }
});

paymentSchema.index({ createdAt: -1, status: 1, verificationStatus: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
