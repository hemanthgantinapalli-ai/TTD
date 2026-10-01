import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  category: { type: String, trim: true, default: 'general' },
  isPublic: { type: Boolean, default: true, index: true },
  description: { type: String, trim: true, default: '' },
}, {
  timestamps: true,
  toJSON: {
    transform(_document, result) {
      delete result.__v;
      return result;
    }
  }
});

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);
