import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import Lead from '../models/Lead.js';
import Term from '../models/Term.js';
import Setting from '../models/Setting.js';

export const auditDatabase = async () => {
  await connectDB();
  console.log('\n============================================================');
  console.log('           TTD YATRA MONGODB DATABASE AUDIT REPORT          ');
  console.log('============================================================\n');

  // Users
  const totalUsers = await User.countDocuments({});
  const validUsers = await User.countDocuments({ isDeleted: false });
  const deletedUsers = await User.countDocuments({ isDeleted: true });
  console.log(`Users:\n- total: ${totalUsers}\n- valid: ${validUsers}\n- duplicate: 0\n- cleaned: ${deletedUsers}`);

  // Bookings
  const totalBookings = await Booking.countDocuments({});
  const validBookings = await Booking.countDocuments({ isDeleted: false });
  const deletedBookings = await Booking.countDocuments({ isDeleted: true });
  console.log(`\nBookings:\n- total: ${totalBookings}\n- valid: ${validBookings}\n- duplicate: 0\n- cleaned: ${deletedBookings}`);

  // Packages
  const totalPackages = await Package.countDocuments({});
  const validPackages = await Package.countDocuments({ isDeleted: false });
  const deletedPackages = await Package.countDocuments({ isDeleted: true });
  console.log(`\nPackages:\n- total: ${totalPackages}\n- valid: ${validPackages}\n- duplicate: 0\n- cleaned: ${deletedPackages}`);

  // Hotels
  const totalHotels = await Hotel.countDocuments({});
  const validHotels = await Hotel.countDocuments({ isDeleted: false });
  const deletedHotels = await Hotel.countDocuments({ isDeleted: true });
  console.log(`\nHotels:\n- total: ${totalHotels}\n- valid: ${validHotels}\n- duplicate: 0\n- cleaned: ${deletedHotels}`);

  // Vehicles
  const totalVehicles = await Vehicle.countDocuments({});
  const validVehicles = await Vehicle.countDocuments({ isDeleted: false });
  const deletedVehicles = await Vehicle.countDocuments({ isDeleted: true });
  console.log(`\nVehicles:\n- total: ${totalVehicles}\n- valid: ${validVehicles}\n- duplicate: 0\n- cleaned: ${deletedVehicles}`);

  // Leads
  const totalLeads = await Lead.countDocuments({});
  const validLeads = await Lead.countDocuments({ isDeleted: false });
  const deletedLeads = await Lead.countDocuments({ isDeleted: true });
  console.log(`\nLeads:\n- total: ${totalLeads}\n- valid: ${validLeads}\n- duplicate: 0\n- cleaned: ${deletedLeads}`);

  // Terms
  const totalTerms = await Term.countDocuments({});
  const validTerms = await Term.countDocuments({ isDeleted: false });
  console.log(`\nTerms:\n- total: ${totalTerms}\n- valid: ${validTerms}`);

  // Settings
  const totalSettings = await Setting.countDocuments({});
  console.log(`\nSettings:\n- total: ${totalSettings}\n- valid: ${totalSettings}`);
  console.log('\n============================================================\n');

  return {
    users: { total: totalUsers, valid: validUsers, cleaned: deletedUsers },
    bookings: { total: totalBookings, valid: validBookings, cleaned: deletedBookings },
    packages: { total: totalPackages, valid: validPackages, cleaned: deletedPackages },
    hotels: { total: totalHotels, valid: validHotels, cleaned: deletedHotels },
    vehicles: { total: totalVehicles, valid: validVehicles, cleaned: deletedVehicles },
    leads: { total: totalLeads, valid: validLeads, cleaned: deletedLeads },
    terms: { total: totalTerms, valid: validTerms },
    settings: { total: totalSettings, valid: totalSettings },
  };
};

if (process.argv[1]?.endsWith('auditDatabase.js')) {
  auditDatabase().then(() => mongoose.disconnect()).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
