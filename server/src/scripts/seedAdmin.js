import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email && !password) return;
  if (!email || !password || password.length < 12) {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters to initialize the admin account.');
  }

  const existingUser = await User.findOne({ email }).select('+passwordHash');
  if (existingUser) {
    const isSamePassword = existingUser.passwordHash
      ? await bcrypt.compare(password, existingUser.passwordHash)
      : false;

    let updated = false;
    if (!isSamePassword) {
      existingUser.passwordHash = await bcrypt.hash(password, 12);
      updated = true;
    }
    if (existingUser.role !== 'admin') {
      existingUser.role = 'admin';
      updated = true;
    }
    if (!existingUser.isActive) {
      existingUser.isActive = true;
      updated = true;
    }

    if (updated) {
      await existingUser.save();
      console.log(`Admin account (${email}) password and permissions updated from environment.`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ email, passwordHash, role: 'admin', name: 'Administrator' });
  console.log(`Initial admin account (${email}) created from backend environment configuration.`);
};

export default seedAdmin;