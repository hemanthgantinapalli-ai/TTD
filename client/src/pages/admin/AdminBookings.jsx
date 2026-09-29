import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    itemName: '1-Day Express VIP Break Darshan & Tirumala Yatra',
    type: 'package',
    amount: 4998,
    date: new Date().toISOString().split('T')[0],
    travellers: 2,
    leadPilgrim: { name: '', phone: '', email: '', city: 'Tirupati' },
    paymentMethod: 'Cash on Arrival',
    notes: 'Created by Admin Desk',
  });

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, typeFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBookings({
        status: statusFilter,
        type: typeFilter,
        search,
      });
      if (res?.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.warn('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking status changed to ${newStatus}`);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to permanently cancel and remove this booking?')) {
      try {
        await adminService.deleteBooking(bookingId);
        toast.success('Booking removed successfully');
        fetchBookings();
      } catch (err) {
        toast.error('Failed to remove booking');
      }
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!newBooking.leadPilgrim.name || !newBooking.leadPilgrim.phone) {
      toast.error('Please enter devotee name and contact phone');
      return;
    }
    try {
      await adminService.createBooking(newBooking);
      toast.success('Manual booking recorded successfully!');
      setShowCreateModal(false);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to create booking');
    }
  };

  return (
    <div>
      {/* Title & Top Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🎟️</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#4A0E1C', margin: 0, fontFamily: 'Cinzel, serif' }}>
              Bookings & Pilgrim Ledger
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B615C', marginTop: '4px' }}>
            Manage all temple yatra, hotel room, and cab reservations in real-time.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '9px 18px',
            fontSize: '13.5px',
            fontWeight: 700,
            borderRadius: '6px',
            border: 'none',
            background: 'linear-gradient(135deg, #4A0E1C 0%, #611626 100%)',
            color: '#F2DEA2',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(74,14,28,0.2)',
          }}
        >
          <span>➕</span> New Manual Booking
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#FFFFFF',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid #E0D4C0',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 12px',
                fontSize: '12.5px',
                borderRadius: '6px',
                fontWeight: statusFilter === st ? 700 : 500,
                border: statusFilter === st ? '1px solid #4A0E1C' : '1px solid #D8CBB8',
                background: statusFilter === st ? '#4A0E1C' : '#FEFCF7',
                color: statusFilter === st ? '#F2DEA2' : '#4A3F3A',
                cursor: 'pointer',
              }}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
        </div>

        {/* Type & Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '7px 10px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid #D8CBB8',
              background: '#fff',
            }}
          >
            <option value="all">All Types</option>
            <option value="package">Packages</option>
            <option value="hotel">Hotels</option>
            <option value="car">Cars / Fleet</option>
          </select>

          <input
            type="text"
            placeholder="Search PNR, devotee, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '7px 12px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid #D8CBB8',
              minWidth: '220px',
              background: '#FEFCF7',
            }}
          />

          <button
            type="submit"
            style={{
              padding: '7px 14px',
              fontSize: '13px',
              borderRadius: '6px',
              background: '#C9A227',
              color: '#320710',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Bookings Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E0D4C0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#FAF0F2', borderBottom: '2px solid #E0D4C0', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px' }}>PNR / ID</th>
                <th style={{ padding: '14px 16px' }}>Lead Devotee</th>
                <th style={{ padding: '14px 16px' }}>Type & Service</th>
                <th style={{ padding: '14px 16px' }}>Date</th>
                <th style={{ padding: '14px 16px' }}>Amount</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6B615C' }}>
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.bookingId} style={{ borderBottom: '1px solid #EDE6D9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#4A0E1C' }}>
                      {b.pnr}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{b.leadPilgrim?.name || 'Devotee'}</div>
                      <div style={{ fontSize: '11px', color: '#6B615C' }}>{b.leadPilgrim?.phone} • {b.leadPilgrim?.city}</div>
                    </td>
                    <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          background: '#F8F2E4',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          marginRight: '6px',
                          fontWeight: 700,
                          color: '#8C6B10',
                        }}
                      >
                        {b.type}
                      </span>
                      <span style={{ fontWeight: 500 }}>{b.itemName}</span>
                      <div style={{ fontSize: '11px', color: '#6B615C', marginTop: '2px' }}>
                        👥 {b.travellers || 1} Travellers
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>{b.date}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#2B2320' }}>
                      ₹{b.amount?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.bookingId, e.target.value)}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #D8CBB8',
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
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            borderRadius: '4px',
                            border: '1px solid #D8CBB8',
                            background: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(b.bookingId)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            borderRadius: '4px',
                            border: '1px solid #FDECEA',
                            background: '#FDECEA',
                            color: '#B3261E',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', maxWidth: '560px', width: '100%', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E0D4C0', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#8C6B10', fontWeight: 700, textTransform: 'uppercase' }}>
                  Yatra Booking Voucher
                </span>
                <h2 style={{ fontSize: '20px', color: '#4A0E1C', margin: '4px 0 0' }}>
                  PNR: {selectedBooking.pnr}
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B615C' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
              <div>
                <strong style={{ color: '#4A3F3A' }}>Booked Service:</strong>
                <div>{selectedBooking.itemName} ({selectedBooking.type})</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <strong style={{ color: '#4A3F3A' }}>Date of Yatra:</strong>
                  <div>{selectedBooking.date}</div>
                </div>
                <div>
                  <strong style={{ color: '#4A3F3A' }}>Devotees Count:</strong>
                  <div>{selectedBooking.travellers || 1} Persons</div>
                </div>
              </div>

              <div style={{ background: '#FAF0F2', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#4A0E1C' }}>Lead Devotee Manifest:</strong>
                <div style={{ marginTop: '4px' }}><strong>Name:</strong> {selectedBooking.leadPilgrim?.name || 'N/A'}</div>
                <div><strong>Phone:</strong> {selectedBooking.leadPilgrim?.phone || 'N/A'}</div>
                <div><strong>Email:</strong> {selectedBooking.leadPilgrim?.email || 'N/A'}</div>
                <div><strong>City:</strong> {selectedBooking.leadPilgrim?.city || 'N/A'}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <strong style={{ color: '#4A3F3A' }}>Payment Method:</strong>
                  <div>{selectedBooking.paymentMethod}</div>
                </div>
                <div>
                  <strong style={{ color: '#4A3F3A' }}>Total Amount:</strong>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#4A0E1C' }}>
                    ₹{selectedBooking.amount?.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <strong style={{ color: '#4A3F3A' }}>Devotee Notes & Requests:</strong>
                  <p style={{ margin: '4px 0 0', fontStyle: 'italic', background: '#F8F2E4', padding: '10px', borderRadius: '6px' }}>
                    "{selectedBooking.notes}"
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E0D4C0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #D8CBB8',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Manual Booking Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleCreateBooking} style={{ background: '#fff', borderRadius: '12px', maxWidth: '540px', width: '100%', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E0D4C0', paddingBottom: '14px', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '18px', color: '#4A0E1C', margin: 0 }}>
                ➕ Create Manual Pilgrimage Booking
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B615C' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Service / Package Name
                </label>
                <input
                  type="text"
                  required
                  value={newBooking.itemName}
                  onChange={(e) => setNewBooking({ ...newBooking, itemName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Category Type
                  </label>
                  <select
                    value={newBooking.type}
                    onChange={(e) => setNewBooking({ ...newBooking, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  >
                    <option value="package">Package</option>
                    <option value="hotel">Hotel</option>
                    <option value="car">Car Rental</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newBooking.amount}
                    onChange={(e) => setNewBooking({ ...newBooking, amount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Date of Travel
                  </label>
                  <input
                    type="date"
                    required
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Travellers Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newBooking.travellers}
                    onChange={(e) => setNewBooking({ ...newBooking, travellers: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Devotee Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramanathan K."
                  value={newBooking.leadPilgrim.name}
                  onChange={(e) => setNewBooking({ ...newBooking, leadPilgrim: { ...newBooking.leadPilgrim, name: e.target.value } })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newBooking.leadPilgrim.phone}
                    onChange={(e) => setNewBooking({ ...newBooking, leadPilgrim: { ...newBooking.leadPilgrim, phone: e.target.value } })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Devotee City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai"
                    value={newBooking.leadPilgrim.city}
                    onChange={(e) => setNewBooking({ ...newBooking, leadPilgrim: { ...newBooking.leadPilgrim, city: e.target.value } })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Special Assistance Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wheelchair assistance, station pickup"
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D8CBB8', background: '#fff' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #4A0E1C 0%, #611626 100%)',
                  color: '#F2DEA2',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Confirm & Create Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
