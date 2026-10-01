import seedAdmin from './seedAdmin.js';
import connectDB from '../config/database.js';
import mongoose from 'mongoose';

export const seedFirstAdmin = seedAdmin;

if (process.argv[1]?.endsWith('seedFirstAdmin.js')) {
  connectDB().then(async () => {
    await seedFirstAdmin();
    await mongoose.disconnect();
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export default seedFirstAdmin;
