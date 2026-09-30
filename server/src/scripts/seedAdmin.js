import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email && !password) return;
  if (!email || !password || password.length < 12) {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters to initialize the admin account.');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ email, passwordHash, role: 'admin', name: 'Administrator' });
  console.log('Initial admin account created from backend environment configuration.');
};

export default seedAdmin;