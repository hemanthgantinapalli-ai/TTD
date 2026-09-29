import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const PaymentFailed = () => {
  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <span className="badge badge-error" style={{ marginBottom: '8px' }}>Payment Incomplete</span>
        <h1 style={{ fontSize: '24px', color: 'var(--color-maroon-900)', marginTop: '8px', marginBottom: '12px' }}>
          Payment Declined by Bank
        </h1>
        <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          No funds were deducted. You can retry with UPI QR code, another debit/credit card, or choose NetBanking.
        </p>

        <div className="flex flex-col gap-2">
          <Link to={ROUTES.PAYMENT} className="btn btn-gold btn-lg" style={{ width: '100%' }}>
            Retry Payment →
          </Link>
          <Link to={ROUTES.BOOKING_REVIEW} className="btn btn-outline btn-sm">
            Modify Booking Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
