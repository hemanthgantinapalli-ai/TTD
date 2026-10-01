import mongoose from 'mongoose';

const paymentAttemptSchema = new mongoose.Schema({
  attemptId: {
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
    index: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    index: true,
  },
  method: {
    type: String,
    default: 'upi',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['initiated', 'processing', 'submitted', 'success', 'failed', 'cancelled'],
    default: 'initiated',
  },
  gatewayReference: {
    type: String,
    default: '',
  },
  utr: {
    type: String,
    default: '',
  },
  failureReason: {
    type: String,
    default: '',
  },
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
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

export default mongoose.models.PaymentAttempt || mongoose.model('PaymentAttempt', paymentAttemptSchema);
