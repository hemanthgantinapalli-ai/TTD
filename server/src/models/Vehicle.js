import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  category: { type: String, trim: true, default: 'Sedan' },
  type: { type: String, trim: true, default: 'Cab' },
  model: { type: String, trim: true, default: '' },
  registrationNumber: { type: String, trim: true, sparse: true, index: true },
  capacity: { type: String, default: '4 Devotees' },
  luggage: { type: String, default: '2 Bags' },
  fuelType: { type: String, default: 'Diesel' },
  ac: { type: Boolean, default: true },
  pricePerDay: { type: Number, required: true, min: 0 },
  perKmRate: { type: Number, min: 0, default: 14 },
  minKmPerDay: { type: Number, default: 250 },
  airportPickupChennai: { type: Number, default: 3400 },
  airportPickupBangalore: { type: Number, default: 4800 },
  airportPickupTirupati: { type: Number, default: 600 },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  thumbnail: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  features: [{ type: String, trim: true }],
  availability: { type: Boolean, default: true },
  status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'active', index: true },
  driverDetails: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    languages: [{ type: String }],
    experienceYears: { type: String, default: '8+ Years' },
  },
  featured: { type: Boolean, default: false },
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

vehicleSchema.index({ status: 1, isDeleted: 1 });

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
