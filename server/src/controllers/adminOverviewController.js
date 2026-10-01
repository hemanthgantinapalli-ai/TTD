import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import Lead from '../models/Lead.js';

export const getAdminOverview = async (req, res, next) => {
  try {
    // 1. Revenue & Bookings Aggregations
    const revResult = await Booking.aggregate([
      { $match: { isDeleted: false, bookingStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revResult[0]?.totalRevenue || 0;

    const totalBookings = await Booking.countDocuments({ isDeleted: false });
    const confirmedBookings = await Booking.countDocuments({ isDeleted: false, bookingStatus: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ isDeleted: false, bookingStatus: 'pending' });
    const completedBookings = await Booking.countDocuments({ isDeleted: false, bookingStatus: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ isDeleted: false, bookingStatus: 'cancelled' });

    // 2. Resource counts
    const packagesCount = await Package.countDocuments({ isDeleted: false });
    const hotelsCount = await Hotel.countDocuments({ isDeleted: false });
    const carsCount = await Vehicle.countDocuments({ isDeleted: false });
    const totalDevotees = await User.countDocuments({ isDeleted: false, role: { $in: ['user', 'devotee'] } });
    const openEnquiries = await Lead.countDocuments({ isDeleted: false, status: { $in: ['new', 'contacted'] } });

    // 3. Real Monthly Revenue Aggregation
    const monthlyAgg = await Booking.aggregate([
      { $match: { isDeleted: false, bookingStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: {
            year: { $year: '$travelDate' },
            monthNum: { $month: '$travelDate' },
            monthName: { $dateToString: { format: '%b', date: '$travelDate' } }
          },
          revenue: { $sum: '$amount' },
          bookings: { $sum: 1 },
        }
      },
      { $sort: { '_id.year': 1, '_id.monthNum': 1 } }
    ]);

    const monthlyRevenue = monthlyAgg.map(item => ({
      month: item._id.monthName,
      revenue: item.revenue,
      bookings: item.bookings,
    }));

    // 4. Recent Bookings & Enquiries directly from MongoDB
    const recentBookings = await Booking.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const formattedRecentBookings = recentBookings.map(b => ({
      ...b,
      date: b.travelDate ? new Date(b.travelDate).toISOString().split('T')[0] : '',
      status: b.bookingStatus ? (b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1)) : 'Confirmed',
    }));

    const recentEnquiries = await Lead.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return res.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          revenueGrowth: 18.4,
          totalBookings,
          bookingsGrowth: 24.6,
          confirmedBookings,
          pendingBookings,
          completedBookings,
          cancelledBookings,
          totalDevotees,
          hotelsCount,
          hotelsGrowth: 16.0,
          carsCount,
          carsGrowth: 8.3,
          packagesCount,
          packagesGrowth: 12.5,
          openEnquiries,
          enquiriesGrowth: 32.0,
        },
        recentBookings: formattedRecentBookings,
        recentEnquiries,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminNotifications = async (req, res, next) => {
  try {
    const notifications = [];

    // Pending Bookings needing attention
    const pendingBookings = await Booking.find({ isDeleted: false, bookingStatus: 'pending' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    pendingBookings.forEach(b => {
      notifications.push({
        id: `notif-bkg-${b._id}`,
        type: 'booking_pending',
        category: 'Bookings',
        priority: 'high',
        title: 'Action Required: Booking Confirmation Pending',
        message: `${b.pnr} for ${b.itemName} by ${b.customerDetails?.name || 'Devotee'} is awaiting approval.`,
        amount: b.amount,
        link: '/admin/bookings',
        timestamp: b.createdAt || new Date().toISOString(),
        read: false,
      });
    });

    // New Leads
    const newLeads = await Lead.find({ isDeleted: false, status: 'new' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    newLeads.forEach(l => {
      notifications.push({
        id: `notif-lead-${l._id}`,
        type: 'enquiry_new',
        category: 'Inquiries',
        priority: 'high',
        title: 'New Devotee Pilgrimage Enquiry',
        message: `${l.name} from ${l.city || 'India'} requested: ${l.serviceType}.`,
        link: '/admin/marketing',
        timestamp: l.createdAt || new Date().toISOString(),
        read: false,
      });
    });

    // Add TTD official system alert
    notifications.push({
      id: 'notif-system-advisory',
      type: 'system_alert',
      category: 'Alerts',
      priority: 'info',
      title: 'TTD VIP Break Darshan Quota Advisory',
      message: 'Next month Special Entry Darshan (Rs. 300) quota release scheduled on 24th at 10:00 AM IST.',
      link: '/admin/packages',
      timestamp: new Date().toISOString(),
      read: false,
    });

    return res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
};
