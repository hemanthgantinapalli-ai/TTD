import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';

const PaymentFailed = () => {
  const location = useLocation();
  const { bookingNumber } = useSelector((state) => state.booking);

  const passedReason = location.state?.reason || 'Payment could not be verified by the bank or accounts desk.';
  const pnr = location.state?.pnr || bookingNumber || 'TTY-RETRY';

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: '40px 16px' }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '36px', textAlign: 'center', border: '1px solid #EAE0D5', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
        <span className="badge badge-error" style={{ marginBottom: '10px', fontSize: '12px', padding: '4px 12px' }}>
          Payment Verification Incomplete
        </span>

        <h1 style={{ fontSize: '22px', color: '#4A0E1C', marginTop: '6px', marginBottom: '12px', fontFamily: 'Cinzel, serif' }}>
          Payment Failed
        </h1>

        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '13px',
          color: '#991B1B',
          marginBottom: '20px',
          textAlign: 'left',
        }}>
          <strong>Reason:</strong> {passedReason}
        </div>

        <p className="text-muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '24px' }}>
          Your booking reference (<strong>{pnr}</strong>) is currently preserved in <em>Payment Pending</em> status. No double charges have been made. You can retry payment immediately using UPI, Card, or Net Banking without creating a duplicate booking.
        </p>

        {/* Section 11 Retry Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to={ROUTES.PAYMENT} className="btn btn-gold btn-lg" style={{ width: '100%', fontWeight: 700 }}>
            Try Again →
          </Link>

          <Link to={ROUTES.PAYMENT} className="btn btn-outline" style={{ width: '100%', fontWeight: 600 }}>
            Change Payment Method
          </Link>

          <Link to={ROUTES.BOOKING_REVIEW} className="btn btn-sm" style={{ color: '#7A6E6A', textDecoration: 'underline', marginTop: '6px' }}>
            Review Pilgrimage Itinerary & Devotees
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
