import express from 'express';
import { getHealth } from '../controllers/healthController.js';
import adminAuth from './adminAuth.js';
import userAuth from './userAuth.js';
import adminRoutes from './adminRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = express.Router();

// System Health Check
router.get('/health', getHealth);

// Authentication Subsystems
router.use('/auth/admin', adminAuth);
router.use('/auth', userAuth);

// Admin Control Center API (Protected by authenticate & requireAdmin)
router.use('/admin', adminRoutes);

// Public Pilgrimage Platform API (MongoDB Source of Truth)
router.use('/', publicRoutes);

export default router;
