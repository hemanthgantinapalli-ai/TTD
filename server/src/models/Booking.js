import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true, index: true },
  pnr: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', default: null },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },
  type: { type: String, enum: ['package', 'hotel', 'car', 'custom'], default: 'package' },
  itemName: { type: String, required: true, trim: true },
  customerDetails: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, default: 'Tirupati' },
    idProofType: { type: String, default: 'Aadhaar' },
    idProofNumber: { type: String, default: '' },
  },
  leadPilgrim: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    city: { type: String, default: '' },
  },
  travellers: { type: Number, default: 1, min: 1 },
  guests: { type: Number, default: 1, min: 1 },
  travelDate: { type: Date, required: true, index: true },
  returnDate: { type: Date, default: null },
  amount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, default: 'UPI' },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true,
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
    index: true,
  },
  notes: { type: String, default: '' },
  internalNotes: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
}, {
  timestamps: true,
  toJSON: {
    transform(_document, result) {
      delete result.__v;
      return result;
    }
  }
});

bookingSchema.index({ travelDate: 1, bookingStatus: 1, paymentStatus: 1, isDeleted: 1 });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
