import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';
import Logo from '../../components/common/Logo/Logo';
import { APP_CONFIG } from '../../config/appConfig';
import styles from './Booking.module.css';

const BookingSuccess = () => {
  const { currentBooking, travellers, selectedDate, selectedSlot, bookingNumber, addOns, selectedRoom, selectedVehicle } = useSelector((state) => state.booking);

  const pnr = bookingNumber || 'TTY-2026-78419';
  const bookingItem = currentBooking.itemData;

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste! My TTD Yatra Booking is confirmed! PNR: ${pnr} for ${bookingItem?.name || bookingItem?.title || 'Pilgrimage Service'} on ${selectedDate || 'Upcoming Date'}.`
  );

  return (
    <div className="section" style={{ minHeight: '90vh', background: 'radial-gradient(circle at 50% 10%, rgba(201, 162, 39, 0.12) 0%, transparent 60%), var(--bg-page)', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Printable Voucher Card */}
        <div className={styles.voucherCard}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
            <Logo size="md" variant="default" showWordmark />
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success" style={{ fontSize: '13px', padding: '4px 12px' }}>
                ✓ BOOKING CONFIRMED
              </span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-maroon-900)', marginTop: '4px' }}>
                PNR: {pnr}
              </div>
            </div>
          </div>

          {/* Blessing Message */}
          <div style={{ textAlign: 'center', margin: '20px 0 32px' }}>
            <div style={{ fontSize: '42px', marginBottom: '8px' }}>🙏</div>
            <h1 style={{ fontSize: '26px', color: 'var(--color-maroon-900)', fontFamily: 'var(--font-display)' }}>
              Govinda Govinda! Your Pilgrimage is Confirmed
            </h1>
            <p className="text-muted" style={{ maxWidth: '560px', margin: '8px auto 0', fontSize: '14px' }}>
              We have dispatched your confirmed pilgrimage voucher via SMS and WhatsApp to <strong>{travellers.lead?.phone || 'your phone'}</strong>.
            </p>
          </div>

          {/* Service & Devotee Matrix */}
          <div style={{ background: 'var(--color-sandal-100)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textTransform: 'uppercase', display: 'block' }}>
                  Pilgrimage Service
                </span>
                <strong style={{ fontSize: '15px', color: 'var(--color-maroon-900)' }}>
                  {bookingItem?.name || bookingItem?.title || 'Tirupati Pilgrimage Service'}
                </strong>
                {selectedRoom && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Room: {selectedRoom.name}</div>}
                {selectedVehicle && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Vehicle: {selectedVehicle.name}</div>}
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textTransform: 'uppercase', display: 'block' }}>
                  Travel Date & Slot
                </span>
                <strong style={{ fontSize: '15px', color: 'var(--color-maroon-900)' }}>
                  📅 {selectedDate || 'Confirmed Schedule'}
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Slot: {selectedSlot || 'Morning Pickup'}</div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textTransform: 'uppercase', display: 'block' }}>
                  Lead Devotee
                </span>
                <strong style={{ fontSize: '15px', color: 'var(--color-maroon-900)' }}>
                  👤 {travellers.lead?.name || 'Devotee Guest'}
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mobile: +91 {travellers.lead?.phone || '98765 43210'}</div>
              </div>
            </div>

            {addOns.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)', fontSize: '12px', color: 'var(--color-neutral-700)' }}>
                ✨ <strong>Included Add-ons:</strong> {addOns.map(a => a.title).join(', ')}
              </div>
            )}
          </div>

          {/* Assigned Driver / Local Help Desk */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-neutral-400)', textTransform: 'uppercase', marginBottom: '4px' }}>
                👨‍✈️ Assigned Hill Driver
              </div>
              <strong style={{ color: 'var(--color-maroon-900)', fontSize: '14px' }}>Murugan Swamy (Ghat Specialist)</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Vehicle: White Toyota Innova (AP 03 TR 4452)
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-neutral-400)', textTransform: 'uppercase', marginBottom: '4px' }}>
                🏢 Tirupati Ground Desk
              </div>
              <strong style={{ color: 'var(--color-maroon-900)', fontSize: '14px' }}>Alipiri Reception Center</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Helpline: {APP_CONFIG.contact.phone}
              </div>
            </div>
          </div>

          {/* Pre-Darshan Checklist */}
          <div style={{ background: 'var(--color-gold-tint)', border: '1px solid var(--color-gold-400)', padding: '20px', borderRadius: '12px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
              🧳 Devotee Yatra Checklist
            </h3>
            <ul style={{ fontSize: '13px', color: 'var(--color-neutral-800)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>✓ Carry original Aadhaar Card / Passport matching registered name.</li>
              <li>✓ Dress in traditional Vedic attire (White Dhoti for Men / Saree or Churidar for Women).</li>
              <li>✓ Leave mobile phones, smart watches & electronic items in vehicle safe locker.</li>
              <li>✓ Report at Alipiri / Hilltop queue 30 minutes prior to scheduled slot.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-outline"
            >
              🖨️ Print Yatra Voucher
            </button>

            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
              style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}
            >
              Share on WhatsApp
            </a>

            <Link to={ROUTES.HOME} className="btn btn-maroon">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
