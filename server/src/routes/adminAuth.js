import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
      return res.status(400).json({ success: false, message: 'Enter a valid email and password' });
    }
    const jwtSecret = process.env.JWT_SECRET || 'ttd_yatra_super_secret_key_development';

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
    if (user.role !== 'admin' || !user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account does not have admin access' });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || '24h' },
    );
    return res.json({ success: true, data: { user: user.toJSON(), accessToken } });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, data: req.user.toJSON() });
});

export default router;