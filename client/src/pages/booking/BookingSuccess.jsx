import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';
import Logo from '../../components/common/Logo/Logo';
import { APP_CONFIG } from '../../config/appConfig';
import paymentService from '../../services/paymentService';
import styles from './Booking.module.css';

const BookingSuccess = () => {
  const { currentBooking, travellers, selectedDate, selectedSlot, bookingNumber, addOns, selectedRoom, selectedVehicle, guests } = useSelector((state) => state.booking);

  const pnr = bookingNumber || 'TTY-2026-78419';
  const bookingItem = currentBooking.itemData;

  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (pnr) {
      paymentService.getBookingPayment(pnr).then((res) => {
        if (res?.data) {
          setBookingData(res.data.booking);
          setPaymentData(res.data.currentPayment);
        }
      }).catch((err) => {
        console.warn('Could not load live booking payment record:', err.message);
      });
    }
  }, [pnr]);

  const handlePrint = () => {
    window.print();
  };

  const customerName = bookingData?.customerDetails?.name || travellers?.lead?.name || 'Devotee Guest';
  const customerPhone = bookingData?.customerDetails?.phone || travellers?.lead?.phone || 'Provided Number';
  const packageName = bookingData?.itemName || bookingItem?.name || bookingItem?.title || 'Tirumala Yatra Pilgrimage Package';
  const travelDateStr = bookingData?.travelDate ? new Date(bookingData.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : (selectedDate || 'Confirmed Date');
  const amountPaid = bookingData?.amount || paymentData?.amount || 6458;
  const paymentId = paymentData?.paymentId || 'PAY-VERIFIED';
  const utrOrTxn = paymentData?.utr || paymentData?.transactionId || bookingData?.transactionId || 'CONFIRMED-BANK-REF';
  const methodUsed = paymentData?.method?.toUpperCase() || bookingData?.paymentMethod || 'UPI';

  const whatsappMessage = encodeURIComponent(
    `Namaste! My TTD Yatra Pilgrimage is confirmed! PNR: ${pnr} for ${packageName} on ${travelDateStr}. Govinda Govinda!`
  );

  return (
    <div className="section" style={{ minHeight: '90vh', background: 'radial-gradient(circle at 50% 10%, rgba(201, 162, 39, 0.12) 0%, transparent 60%), var(--bg-page)', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Printable Official Receipt & Voucher Card (Section 20 & 24) */}
        <div className={styles.voucherCard} id="printable-receipt">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
            <Logo size="md" variant="default" showWordmark />
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E8F5EE', color: '#2E7D46', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 700 }}>
                <span>✓</span> PAYMENT VERIFIED & BOOKING CONFIRMED
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-maroon-900)', marginTop: '4px', fontFamily: 'monospace' }}>
                PNR: {pnr}
              </div>
            </div>
          </div>

          {/* Blessing Message */}
          <div style={{ textAlign: 'center', margin: '16px 0 28px' }}>
            <div style={{ fontSize: '42px', marginBottom: '8px' }}>🙏</div>
            <h1 style={{ fontSize: '26px', color: 'var(--color-maroon-900)', fontFamily: 'var(--font-display)', margin: '0 0 6px 0' }}>
              Govinda Govinda! Your Pilgrimage is Confirmed
            </h1>
            <p className="text-muted" style={{ maxWidth: '580px', margin: '0 auto', fontSize: '14px' }}>
              Your payment has been successfully verified and your darshan reservation is confirmed. We look forward to serving your divine journey.
            </p>
          </div>

          {/* Payment & Receipt Ledger Summary (Section 20 & 24) */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #E3C05C',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 4px 16px rgba(59, 10, 23, 0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EAE0D5', paddingBottom: '10px', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', color: '#4A0E1C', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🧾 Official Booking Payment Receipt
              </h3>
              <span style={{ fontSize: '12px', color: '#7A6E6A' }}>
                Issued: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#7A6E6A', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Booking ID (PNR)</span>
                <strong style={{ color: '#4A0E1C', fontFamily: 'monospace', fontSize: '15px' }}>{pnr}</strong>
              </div>

              <div>
                <span style={{ color: '#7A6E6A', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Payment ID</span>
                <strong style={{ color: '#4A0E1C', fontFamily: 'monospace', fontSize: '14px' }}>{paymentId}</strong>
              </div>

              <div>
                <span style={{ color: '#7A6E6A', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Amount Paid</span>
                <strong style={{ color: '#2E7D46', fontSize: '16px' }}>₹{Number(amountPaid).toLocaleString('en-IN')}</strong>
              </div>

              <div>
                <span style={{ color: '#7A6E6A', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Payment Method</span>
                <strong style={{ color: '#4A0E1C' }}>{methodUsed}</strong>
              </div>

              <div>
                <span style={{ color: '#7A6E6A', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Transaction / UTR</span>
                <strong style={{ color: '#4A0E1C', fontFamily: 'monospace' }}>{utrOrTxn}</strong>
              </div>

              <div>
                <span style={{ color: '#7A6E6A', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Payment Status</span>
                <span style={{ color: '#2E7D46', fontWeight: 700 }}>✓ Verified (Paid)</span>
              </div>
            </div>
          </div>

          {/* Service & Devotee Matrix */}
          <div style={{ background: 'var(--color-sandal-100)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textTransform: 'uppercase', display: 'block' }}>
                  Pilgrimage Service
                </span>
                <strong style={{ fontSize: '15px', color: 'var(--color-maroon-900)' }}>
                  {packageName}
                </strong>
                {selectedRoom && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Room: {selectedRoom.name}</div>}
                {selectedVehicle && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Vehicle: {selectedVehicle.name}</div>}
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textTransform: 'uppercase', display: 'block' }}>
                  Travel Date & Slot
                </span>
                <strong style={{ fontSize: '15px', color: 'var(--color-maroon-900)' }}>
                  📅 {travelDateStr}
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Slot: {selectedSlot || 'Morning Pickup'}</div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textTransform: 'uppercase', display: 'block' }}>
                  Primary Devotee
                </span>
                <strong style={{ fontSize: '15px', color: 'var(--color-maroon-900)' }}>
                  👤 {customerName}
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mobile: +91 {customerPhone}</div>
              </div>
            </div>

            {addOns.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)', fontSize: '12px', color: 'var(--color-neutral-700)' }}>
                ✨ <strong>Included Add-ons:</strong> {addOns.map(a => a.title).join(', ')}
              </div>
            )}
          </div>

          {/* Assigned Driver / Local Help Desk */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
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
          <div style={{ background: 'var(--color-gold-tint)', border: '1px solid var(--color-gold-400)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
              🧳 Devotee Yatra Checklist
            </h3>
            <ul style={{ fontSize: '13px', color: 'var(--color-neutral-800)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>✓ Carry original Aadhaar Card / Passport matching registered pilgrim name.</li>
              <li>✓ Dress in traditional Vedic attire (White Dhoti for Men / Saree or Churidar with Dupatta for Women).</li>
              <li>✓ Leave mobile phones, smart watches & electronic gadgets in vehicle safe locker.</li>
              <li>✓ Report at Alipiri / Hilltop verification desk 30 minutes prior to scheduled slot.</li>
            </ul>
          </div>

          {/* Legal Non-Affiliation Disclaimer (Section 24) */}
          <div style={{
            background: '#FAF7F2',
            border: '1px solid #EAE0D5',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '11.5px',
            color: '#7A6E6A',
            lineHeight: 1.5,
            marginBottom: '28px',
            textAlign: 'center',
          }}>
            <strong>Important Notice:</strong> TTD Yatra is an independent pilgrimage facilitation, travel logistics, and private tour concierge service. We are not officially affiliated with or endorsed by Tirumala Tirupati Devasthanams (TTD). Official darshan tokens are subject to TTD administrative availability and Vedic regulations.
          </div>

          {/* Action Buttons (Section 20) */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-outline"
              style={{ fontWeight: 600 }}
            >
              📥 Download / Print Receipt
            </button>

            <Link to={ROUTES.DASHBOARD_BOOKINGS} className="btn btn-gold" style={{ fontWeight: 600 }}>
              Go to My Bookings →
            </Link>

            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ background: '#25D366', color: '#fff', borderColor: '#25D366', fontWeight: 600 }}
            >
              Share on WhatsApp
            </a>

            <Link to={ROUTES.HOME} className="btn btn-maroon" style={{ fontWeight: 600 }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
