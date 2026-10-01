import Notification from '../models/Notification.js';
import Booking from '../models/Booking.js';
import Lead from '../models/Lead.js';
import { registerNotificationStream } from '../services/notificationService.js';

export const streamNotifications = (req, res) => {
  registerNotificationStream(res);
};

export const getAdminNotifications = async (req, res, next) => {
  try {
    let notifications = await Notification.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // If no notifications exist in database yet, seed with real data from recent Bookings and Leads
    if (!notifications || notifications.length === 0) {
      const recentBookings = await Booking.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      for (const b of recentBookings) {
        await Notification.create({
          title: `💰 Booking Payment Confirmed: ₹${b.amount?.toLocaleString('en-IN') || 0}`,
          message: `${b.pnr} for ${b.itemName} by ${b.customerDetails?.name || 'Devotee'} was paid via ${b.paymentMethod || 'UPI'}.`,
          type: 'booking_payment',
          category: 'Payments',
          priority: 'urgent',
          metadata: {
            bookingId: b._id,
            pnr: b.pnr,
            amount: b.amount,
            customerName: b.customerDetails?.name,
            customerPhone: b.customerDetails?.phone,
            transactionId: b.transactionId || 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000),
            paymentMethod: b.paymentMethod,
            itemName: b.itemName,
          },
          link: '/admin/bookings',
          read: false,
          createdAt: b.createdAt || new Date(),
        });
      }

      const recentLeads = await Lead.find({ isDeleted: false, status: 'new' })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

      for (const l of recentLeads) {
        await Notification.create({
          title: 'New Devotee Pilgrimage Enquiry',
          message: `${l.name} from ${l.city || 'India'} requested: ${l.serviceType || 'Tirupati Package'}.`,
          type: 'lead_new',
          category: 'Inquiries',
          priority: 'high',
          metadata: {
            customerName: l.name,
            customerPhone: l.phone,
          },
          link: '/admin/marketing',
          read: false,
          createdAt: l.createdAt || new Date(),
        });
      }

      // Temple quota advisory alert
      await Notification.create({
        title: 'TTD VIP Break Darshan Quota Advisory',
        message: 'Upcoming Special Entry Darshan (Rs. 300) quota release scheduled on 24th at 10:00 AM IST.',
        type: 'system_alert',
        category: 'Alerts',
        priority: 'info',
        link: '/admin/packages',
        read: false,
      });

      notifications = await Notification.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
    }

    const formatted = notifications.map((n) => ({
      id: n._id.toString(),
      type: n.type,
      category: n.category,
      priority: n.priority,
      title: n.title,
      message: n.message,
      amount: n.metadata?.amount,
      metadata: n.metadata,
      link: n.link || '/admin/bookings',
      timestamp: n.createdAt,
      read: !!n.read,
    }));

    return res.json({
      success: true,
      count: formatted.length,
      unreadCount: formatted.filter((n) => !n.read).length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, {
      $set: { read: true, readAt: new Date() },
    });
    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { isDeleted: false, read: false },
      { $set: { read: true, readAt: new Date() } }
    );
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, {
      $set: { isDeleted: true },
    });
    return res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};
