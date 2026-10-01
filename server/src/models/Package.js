import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  shortDescription: { type: String, trim: true, default: '' },
  tagline: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  category: { type: String, trim: true, default: 'General' },
  duration: { type: String, required: true, trim: true },
  startingPrice: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0, default: 0 },
  rating: { type: Number, min: 1, max: 5, default: 4.8 },
  reviewCount: { type: Number, default: 0, min: 0 },
  badge: { type: String, trim: true, default: '' },
  thumbnail: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  gallery: [{ type: String, trim: true }],
  locations: [{ type: String, trim: true }],
  highlights: [{ type: String, trim: true }],
  itinerary: [{
    time: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  }],
  inclusions: [{ type: String, trim: true }],
  exclusions: [{ type: String, trim: true }],
  darshanDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  hotelDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  vehicleDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  availability: { type: String, default: 'Daily Available' },
  status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'active', index: true },
  featured: { type: Boolean, default: false, index: true },
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

packageSchema.index({ status: 1, featured: 1, isDeleted: 1 });

export default mongoose.models.Package || mongoose.model('Package', packageSchema);
