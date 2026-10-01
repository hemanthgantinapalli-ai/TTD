import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true, default: '', index: true },
  phone: { type: String, required: true, trim: true, index: true },
  city: { type: String, trim: true, default: '' },
  serviceType: { type: String, trim: true, default: 'General Pilgrimage' },
  travellersCount: { type: Number, default: 1, min: 1 },
  preferredDate: { type: String, default: '' },
  message: { type: String, trim: true, default: '' },
  source: { type: String, trim: true, default: 'Website Inquiry' },
  interestedPackage: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'closed'],
    default: 'new',
    index: true,
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  notes: { type: String, default: '' },
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

leadSchema.index({ status: 1, createdAt: -1, isDeleted: 1 });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
