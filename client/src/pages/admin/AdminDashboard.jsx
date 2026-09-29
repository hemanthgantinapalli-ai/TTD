import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { ROUTES } from '../../constants/routes';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOverview();
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Error loading admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (bookingId, newStatus) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
      loadOverview();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const stats = data?.stats || {
    totalRevenue: 298798,
    totalBookings: 6,
    confirmedBookings: 4,
    pendingBookings: 1,
    completedBookings: 1,
    totalDevotees: 5,
    hotelsCount: 6,
    carsCount: 4,
    packagesCount: 3,
    openEnquiries: 2,
  };

  const recentBookings = data?.recentBookings || [];
  const recentEnquiries = data?.recentEnquiries || [];
  const monthlyRevenue = data?.monthlyRevenue || [];

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4A0E1C 0%, #30060F 100%)',
          borderRadius: '12px',
          padding: '24px 30px',
          color: '#FAF0F2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          boxShadow: '0 4px 16px rgba(50,7,16,0.15)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🕉️</span>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, fontFamily: 'Cinzel, serif', color: '#F2DEA2' }}>
              Sri Venkateswara Admin Command
            </h1>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#F3DEE2', maxWidth: '600px' }}>
            Real-time management for Tirupati Yatra bookings, sanitized hill fleet, temple packages, and all terms & policies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to={ROUTES.ADMIN_CMS}
            style={{
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '6px',
              background: '#E3C05C',
              color: '#320710',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📜</span> Manage All Terms
          </Link>
          <Link
            to={ROUTES.ADMIN_BOOKINGS}
            style={{
              padding: '9px 16px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              textDecoration: 'none',
            }}
          >
            Bookings Ledger →
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '18px',
          marginBottom: '28px',
        }}
      >
        {/* Total Revenue */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E5DFD5', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B615C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Revenue</span>
            <span style={{ fontSize: '20px' }}>💰</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#4A0E1C', marginTop: '8px' }}>
            ₹{stats.totalRevenue?.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#2E7D46', fontWeight: 600, marginTop: '6px' }}>
            ↑ 22.4% vs last month
          </div>
        </div>

        {/* Bookings */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E5DFD5', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B615C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Bookings</span>
            <span style={{ fontSize: '20px' }}>🎟️</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#4A0E1C', marginTop: '8px' }}>
            {stats.totalBookings}
          </div>
          <div style={{ fontSize: '11px', color: '#6B615C', marginTop: '6px' }}>
            <strong style={{ color: '#2E7D46' }}>{stats.confirmedBookings} Confirmed</strong> • {stats.pendingBookings} Pending
          </div>
        </div>

        {/* Packages */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E5DFD5', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B615C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Yatra Packages</span>
            <span style={{ fontSize: '20px' }}>📦</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#4A0E1C', marginTop: '8px' }}>
            {stats.packagesCount} Active
          </div>
          <div style={{ fontSize: '11px', color: '#6B615C', marginTop: '6px' }}>
            VIP Break, 2-Day, Senior Citizen
          </div>
        </div>

        {/* Hotels */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E5DFD5', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B615C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Partner Stays</span>
            <span style={{ fontSize: '20px' }}>🏨</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#4A0E1C', marginTop: '8px' }}>
            {stats.hotelsCount} Verified
          </div>
          <div style={{ fontSize: '11px', color: '#B97A00', fontWeight: 600, marginTop: '6px' }}>
            Pure Vegetarian & Luxury Stays
          </div>
        </div>

        {/* Fleet */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E5DFD5', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B615C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hill Fleet Cabs</span>
            <span style={{ fontSize: '20px' }}>🚗</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#4A0E1C', marginTop: '8px' }}>
            {stats.carsCount} Vehicles
          </div>
          <div style={{ fontSize: '11px', color: '#6B615C', marginTop: '6px' }}>
            100% Ghat-road certified drivers
          </div>
        </div>

        {/* Open Inquiries */}
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E5DFD5', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B615C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Devotee Leads</span>
            <span style={{ fontSize: '20px' }}>📩</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: stats.openEnquiries > 0 ? '#C96412' : '#2E7D46', marginTop: '8px' }}>
            {stats.openEnquiries} New
          </div>
          <div style={{ fontSize: '11px', color: '#6B615C', marginTop: '6px' }}>
            Trip assistance & custom quotes
          </div>
        </div>
      </div>

      {/* Main Grid: Bookings & Monthly Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Monthly Performance Visual */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '10px', border: '1px solid #E5DFD5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: 0 }}>
              📈 Revenue & Booking Trajectory
            </h3>
            <span style={{ fontSize: '12px', color: '#6B615C' }}>2026 Season</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {monthlyRevenue.map((item) => (
              <div key={item.month}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#4A3F3A' }}>{item.month} 2026</span>
                  <span style={{ fontWeight: 700, color: '#4A0E1C' }}>
                    ₹{item.revenue.toLocaleString('en-IN')} ({item.bookings} yatras)
                  </span>
                </div>
                <div style={{ height: '8px', background: '#F3DEE2', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (item.revenue / 350000) * 100)}%`,
                      background: 'linear-gradient(90deg, #A88318 0%, #C9A227 100%)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E5DFD5', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B615C' }}>
            <div>Avg Booking Value: <strong>₹3,950</strong></div>
            <div>Repeat Devotees: <strong>41%</strong></div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '10px', border: '1px solid #E5DFD5' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: '0 0 16px' }}>
            ⚡ Fast Actions
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <Link
              to={ROUTES.ADMIN_CMS}
              style={{
                padding: '14px',
                borderRadius: '8px',
                background: '#FFF8E6',
                border: '1px solid #F2DEA2',
                color: '#8C6B10',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '20px' }}>📜</span>
              <strong style={{ fontSize: '13px' }}>Edit All Terms</strong>
              <span style={{ fontSize: '11px', color: '#6B615C' }}>Policies, rules & banner</span>
            </Link>

            <Link
              to={ROUTES.ADMIN_BOOKINGS}
              style={{
                padding: '14px',
                borderRadius: '8px',
                background: '#FAF0F2',
                border: '1px solid #F3DEE2',
                color: '#4A0E1C',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🎟️</span>
              <strong style={{ fontSize: '13px' }}>Manage Bookings</strong>
              <span style={{ fontSize: '11px', color: '#6B615C' }}>Status & refunds</span>
            </Link>

            <Link
              to={ROUTES.ADMIN_PACKAGES}
              style={{
                padding: '14px',
                borderRadius: '8px',
                background: '#F8F6F0',
                border: '1px solid #E0D4C0',
                color: '#2B2320',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '20px' }}>📦</span>
              <strong style={{ fontSize: '13px' }}>Yatra Packages</strong>
              <span style={{ fontSize: '11px', color: '#6B615C' }}>Add/edit tours</span>
            </Link>

            <Link
              to={ROUTES.ADMIN_HOTELS}
              style={{
                padding: '14px',
                borderRadius: '8px',
                background: '#F8F6F0',
                border: '1px solid #E0D4C0',
                color: '#2B2320',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🏨</span>
              <strong style={{ fontSize: '13px' }}>Hotels Directory</strong>
              <span style={{ fontSize: '11px', color: '#6B615C' }}>Rates & inventory</span>
            </Link>

            <Link
              to={ROUTES.ADMIN_CARS}
              style={{
                padding: '14px',
                borderRadius: '8px',
                background: '#F8F6F0',
                border: '1px solid #E0D4C0',
                color: '#2B2320',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🚗</span>
              <strong style={{ fontSize: '13px' }}>Fleet Vehicles</strong>
              <span style={{ fontSize: '11px', color: '#6B615C' }}>Cabs & drivers</span>
            </Link>

            <Link
              to={ROUTES.ADMIN_SETTINGS}
              style={{
                padding: '14px',
                borderRadius: '8px',
                background: '#F8F6F0',
                border: '1px solid #E0D4C0',
                color: '#2B2320',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '20px' }}>⚙️</span>
              <strong style={{ fontSize: '13px' }}>Settings</strong>
              <span style={{ fontSize: '11px', color: '#6B615C' }}>Hotlines & WhatsApp</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Bookings Ledger Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5DFD5', padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: 0 }}>
              Recent Devotee Bookings
            </h3>
            <span style={{ fontSize: '12.5px', color: '#6B615C' }}>
              Live vouchers generated across packages, hotels, and fleet
            </span>
          </div>

          <Link to={ROUTES.ADMIN_BOOKINGS} style={{ fontSize: '13px', color: '#8C2A3B', fontWeight: 600, textDecoration: 'none' }}>
            View All Bookings ({stats.totalBookings}) →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#FAF0F2', borderBottom: '2px solid #E5DFD5', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>PNR</th>
                <th style={{ padding: '12px' }}>Devotee Name</th>
                <th style={{ padding: '12px' }}>Item Booked</th>
                <th style={{ padding: '12px' }}>Travel Date</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.bookingId} style={{ borderBottom: '1px solid #EDE6D9' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#4A0E1C' }}>
                    {b.pnr}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600 }}>{b.leadPilgrim?.name || 'Devotee'}</div>
                    <div style={{ fontSize: '11px', color: '#6B615C' }}>{b.leadPilgrim?.phone}</div>
                  </td>
                  <td style={{ padding: '12px', maxWidth: '260px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', background: '#F8F2E4', padding: '2px 6px', borderRadius: '4px', marginRight: '6px', fontWeight: 600 }}>
                      {b.type}
                    </span>
                    <span style={{ fontWeight: 500 }}>{b.itemName}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{b.date}</td>
                  <td style={{ padding: '12px', fontWeight: 700 }}>
                    ₹{b.amount?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background:
                          b.status === 'Confirmed'
                            ? '#EBF5EF'
                            : b.status === 'Pending'
                            ? '#FFF8E6'
                            : b.status === 'Completed'
                            ? '#EBF1FB'
                            : '#FDECEA',
                        color:
                          b.status === 'Confirmed'
                            ? '#2E7D46'
                            : b.status === 'Pending'
                            ? '#B97A00'
                            : b.status === 'Completed'
                            ? '#1E5AA8'
                            : '#B3261E',
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={b.status}
                      onChange={(e) => handleQuickStatusChange(b.bookingId, e.target.value)}
                      style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #D8CBB8',
                        background: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Enquiries & Leads */}
      <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5DFD5', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: 0 }}>
              Recent Trip Assistance Inquiries
            </h3>
            <span style={{ fontSize: '12.5px', color: '#6B615C' }}>
              Custom yatra and senior citizen pilgrimage assistance requests
            </span>
          </div>

          <Link to={ROUTES.ADMIN_MARKETING} style={{ fontSize: '13px', color: '#8C2A3B', fontWeight: 600, textDecoration: 'none' }}>
            View All Inquiries →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {recentEnquiries.map((enq) => (
            <div key={enq.id} style={{ background: '#FEFCF7', border: '1px solid #E0D4C0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#4A0E1C' }}>{enq.name}</strong>
                  <div style={{ fontSize: '12px', color: '#6B615C' }}>{enq.city} • 📞 {enq.phone}</div>
                </div>
                <span style={{ background: '#FFF8E6', color: '#B97A00', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                  {enq.status}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#8C6B10', marginBottom: '4px' }}>
                {enq.serviceType}
              </div>
              <p style={{ fontSize: '12px', color: '#4A3F3A', margin: '4px 0 10px', fontStyle: 'italic', background: '#F8F2E4', padding: '8px', borderRadius: '4px' }}>
                "{enq.message}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: '#6B615C' }}>
                <span>Date: <strong>{enq.preferredDate}</strong> ({enq.travellersCount} Devotees)</span>
                <a
                  href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: '#25D366',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  WhatsApp Lead ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
