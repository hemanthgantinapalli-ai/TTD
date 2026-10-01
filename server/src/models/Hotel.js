import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  id: { type: String, default: '' },
  name: { type: String, required: true },
  bedType: { type: String, default: '1 King Bed' },
  maxGuests: { type: Number, default: 2 },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  size: { type: String, default: '' },
  features: [{ type: String }],
  image: { type: String, default: '' },
}, { _id: false });

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  tagline: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  location: { type: String, required: true, trim: true },
  address: { type: String, trim: true, default: '' },
  category: { type: String, trim: true, default: '4-Star' },
  starRating: { type: Number, min: 1, max: 5, default: 4 },
  reviewRating: { type: Number, min: 1, max: 5, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  pricePerNight: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0, default: 0 },
  vegOnly: { type: Boolean, default: false },
  hasVegKitchen: { type: Boolean, default: true },
  proximity: {
    railwayStation: { type: String, default: '' },
    airport: { type: String, default: '' },
    alipiriTollGate: { type: String, default: '' },
    busStand: { type: String, default: '' },
  },
  thumbnail: { type: String, trim: true, default: '' },
  images: [{ type: String, trim: true }],
  amenities: [{ type: String, trim: true }],
  rooms: [roomSchema],
  contact: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  mapLocation: {
    lat: { type: Number },
    lng: { type: Number },
    embedUrl: { type: String, default: '' },
  },
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

hotelSchema.index({ status: 1, featured: 1, isDeleted: 1 });

export default mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
