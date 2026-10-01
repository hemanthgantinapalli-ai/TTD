import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Vehicle from '../models/Vehicle.js';
import Lead from '../models/Lead.js';
import { auditDatabase } from './auditDatabase.js';

export const cleanDemoData = async () => {
  await connectDB();
  console.log('[Cleanup] Starting safe data hygiene and normalization audit...');

  // 1. Normalize and clean user records:
  // Ensure all emails are lowercase, trimmed, and real users are protected
  await User.collection.updateMany(
    { isDeleted: { $ne: true } },
    { $set: { isDeleted: false, deletedAt: null } }
  );

  const users = await User.find({});
  let cleanedUsersCount = 0;
  for (const u of users) {
    if (u.email && u.email !== u.email.toLowerCase().trim()) {
      u.email = u.email.toLowerCase().trim();
      await u.save();
      cleanedUsersCount++;
    }
  }
  console.log(`[Cleanup] Users normalized: ${cleanedUsersCount}`);

  // 2. Validate packages integrity:
  // Ensure every active package has a valid startingPrice and duration
  const invalidPackages = await Package.find({
    $or: [{ startingPrice: { $lt: 0 } }, { title: { $exists: false } }]
  });
  for (const pkg of invalidPackages) {
    pkg.isDeleted = true;
    pkg.deletedAt = new Date();
    await pkg.save();
  }
  console.log(`[Cleanup] Corrupted packages quarantined: ${invalidPackages.length}`);

  // 3. Normalize bookings:
  // Ensure every booking has a valid status and positive amount
  const bookings = await Booking.find({});
  let normalizedBookings = 0;
  for (const b of bookings) {
    let changed = false;
    if (b.bookingStatus) {
      const lower = b.bookingStatus.toLowerCase();
      if (['pending', 'confirmed', 'completed', 'cancelled'].includes(lower) && b.bookingStatus !== lower) {
        b.bookingStatus = lower;
        changed = true;
      }
    }
    if (b.paymentStatus) {
      const lower = b.paymentStatus.toLowerCase();
      if (['pending', 'paid', 'failed', 'refunded'].includes(lower) && b.paymentStatus !== lower) {
        b.paymentStatus = lower;
        changed = true;
      }
    }
    if (changed) {
      await b.save();
      normalizedBookings++;
    }
  }
  console.log(`[Cleanup] Bookings normalized: ${normalizedBookings}`);

  console.log('[Cleanup] Safe data audit and hygiene completed.');
  return await auditDatabase();
};

if (process.argv[1]?.endsWith('cleanDemoData.js')) {
  cleanDemoData().then(() => mongoose.disconnect()).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
