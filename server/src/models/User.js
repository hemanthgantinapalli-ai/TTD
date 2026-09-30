import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: '' },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: {
    transform(_document, result) {
      delete result.passwordHash;
      delete result.__v;
      return result;
    },
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);