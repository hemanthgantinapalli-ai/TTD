import mongoose from 'mongoose';

const termSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true, index: true },
  title: { type: String, required: true, trim: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  version: { type: String, default: '1.0' },
  status: { type: String, enum: ['draft', 'published'], default: 'published', index: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  lastUpdated: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }) },
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: {
    transform(_document, result) {
      delete result.__v;
      return result;
    }
  }
});

export default mongoose.models.Term || mongoose.model('Term', termSchema);
