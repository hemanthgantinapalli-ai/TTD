import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';

const MOCK_USER_BOOKINGS = [
  {
    id: 'bk-9910',
    pnr: 'TTY-2026-88192',
    title: '1-Day Express VIP Break Darshan & Tirumala Yatra',
    date: '18 October 2026',
    status: 'Confirmed',
    type: 'Package',
    amount: 4998,
    driver: 'Murugan Swamy (+91 94432 10982)',
    vehicle: 'White Toyota Innova (AP 03 TR 4452)',
  },
  {
    id: 'bk-9801',
    pnr: 'TTY-2026-72410',
    title: 'Fortune Select Grand Ridge - Deluxe AC Room',
    date: '12 September 2026',
    status: 'Completed',
    type: 'Hotel',
    amount: 4800,
    driver: 'N/A (Hotel Stay)',
    vehicle: 'N/A',
  }
];

const MyBookings = () => {
  const { bookingNumber, currentBooking } = useSelector((state) => state.booking);

  return (
    <div className="card" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="eyebrow">Your Pilgrimage History</span>
          <h1 style={{ fontSize: '24px', color: 'var(--color-maroon-900)', marginTop: '4px' }}>
            My Bookings & Yatra Vouchers
          </h1>
        </div>
        <Link to={ROUTES.PACKAGES} className="btn btn-gold btn-sm">
          + Book New Yatra
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {MOCK_USER_BOOKINGS.map((bk) => (
          <div key={bk.id} className="card" style={{ padding: '20px', background: 'var(--color-sandal-100)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className={`badge ${bk.status === 'Confirmed' ? 'badge-success' : 'badge-gold'}`} style={{ marginBottom: '6px' }}>
                  {bk.status}
                </span>
                <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)' }}>{bk.title}</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  PNR: <strong>{bk.pnr}</strong> • 📅 {bk.date}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="price" style={{ fontSize: '20px' }}>₹{bk.amount.toLocaleString('en-IN')}</span>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Paid Online</div>
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '12px', color: 'var(--color-neutral-800)' }}>
              <div>👨‍✈️ <strong>Assigned Driver:</strong> {bk.driver}</div>
              <div>🚗 <strong>Vehicle:</strong> {bk.vehicle}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <Link to={ROUTES.DOWNLOAD_INVOICE(bk.pnr)} className="btn btn-outline btn-sm">
                View Tax Invoice
              </Link>
              <Link to={ROUTES.BOOKING_SUCCESS} className="btn btn-gold btn-sm">
                Open Yatra Voucher
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
