import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/authenticate.js';

import {
  getAdminOverview,
  getAdminNotifications,
} from '../controllers/adminOverviewController.js';

import {
  adminGetAllPackages,
  adminGetPackageById,
  adminCreatePackage,
  adminUpdatePackage,
  adminDeletePackage,
} from '../controllers/packageController.js';

import {
  adminGetAllHotels,
  adminGetHotelById,
  adminCreateHotel,
  adminUpdateHotel,
  adminDeleteHotel,
} from '../controllers/hotelController.js';

import {
  adminGetAllVehicles,
  adminGetVehicleById,
  adminCreateVehicle,
  adminUpdateVehicle,
  adminDeleteVehicle,
} from '../controllers/vehicleController.js';

import {
  adminGetAllBookings,
  adminGetBookingById,
  adminUpdateBookingStatus,
  adminDeleteBooking,
} from '../controllers/bookingController.js';

import {
  adminGetUsers,
  adminGetUserById,
  adminUpdateUser,
  adminDeleteUser,
} from '../controllers/userManagementController.js';

import {
  adminGetAllLeads,
  adminUpdateLeadStatus,
  adminDeleteLead,
} from '../controllers/leadController.js';

import {
  adminGetTerms,
  adminUpdateTerms,
} from '../controllers/termsController.js';

import {
  adminGetSettings,
  adminUpdateSettings,
} from '../controllers/settingsController.js';

import {
  adminGetAuditLogs,
} from '../controllers/adminAuditController.js';

const router = Router();

// Mandatory Authentication & Admin Role Enforcement
router.use(authenticate, requireAdmin);

// Overview & Telemetry
router.get('/overview', getAdminOverview);
router.get('/notifications', getAdminNotifications);
router.post('/notifications/:id/read', (req, res) => res.json({ success: true }));
router.post('/notifications/mark-all-read', (req, res) => res.json({ success: true }));
router.get('/audit-logs', adminGetAuditLogs);

// Packages Management
router.get('/packages', adminGetAllPackages);
router.get('/packages/:id', adminGetPackageById);
router.post('/packages', adminCreatePackage);
router.put('/packages/:id', adminUpdatePackage);
router.delete('/packages/:id', adminDeletePackage);

// Hotels Management
router.get('/hotels', adminGetAllHotels);
router.get('/hotels/:id', adminGetHotelById);
router.post('/hotels', adminCreateHotel);
router.put('/hotels/:id', adminUpdateHotel);
router.delete('/hotels/:id', adminDeleteHotel);

// Fleet / Cabs Management
router.get('/cars', adminGetAllVehicles);
router.get('/cars/:id', adminGetVehicleById);
router.post('/cars', adminCreateVehicle);
router.put('/cars/:id', adminUpdateVehicle);
router.delete('/cars/:id', adminDeleteVehicle);

// Bookings Ledger
router.get('/bookings', adminGetAllBookings);
router.get('/bookings/:id', adminGetBookingById);
router.put('/bookings/:id/status', adminUpdateBookingStatus);
router.delete('/bookings/:id', adminDeleteBooking);

// Devotees & Users Management
router.get('/users', adminGetUsers);
router.get('/users/:id', adminGetUserById);
router.put('/users/:id', adminUpdateUser);
router.delete('/users/:id', adminDeleteUser);

// Inquiries & Leads Management
router.get('/enquiries', adminGetAllLeads);
router.put('/enquiries/:id', adminUpdateLeadStatus);
router.delete('/enquiries/:id', adminDeleteLead);

// Terms & Legal Policies
router.get('/terms', adminGetTerms);
router.put('/terms', adminUpdateTerms);

// Platform Settings
router.get('/settings', adminGetSettings);
router.put('/settings', adminUpdateSettings);

export default router;
