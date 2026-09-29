import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const DEFAULT_REFUND = `1. Free Cancellation Window
Devotees may cancel hotel or vehicle reservations up to 24 hours prior to the scheduled pickup or check-in time for a 100% full refund with ZERO cancellation charges.

2. Standard Cancellation (< 24 Hours)
For cancellations made within 24 hours of scheduled arrival or service commencement, a nominal 10% administrative processing fee will be retained, and 90% of the total amount will be refunded.

3. Emergency & Train / Flight Delay Protection
If your arrival in Tirupati is delayed or cancelled due to certified train or airline cancellations, we allow complimentary rescheduling to any available date within 90 days, or an 85% immediate refund upon verification.

4. Refund Disbursement Timelines
Approved refunds are initiated within 2 business hours and reflect in the original payment bank account or UPI handle within 3 to 5 business days, subject to the issuing bank's clearing cycle.`;

const RefundPolicy = () => {
  const [refundPolicy, setRefundPolicy] = useState(DEFAULT_REFUND);
  const [lastUpdated, setLastUpdated] = useState('September 2026');

  useEffect(() => {
    api.get('/terms')
      .then((res) => {
        if (res.data?.data?.refundPolicy) {
          setRefundPolicy(res.data.data.refundPolicy);
          if (res.data.data.lastUpdated) setLastUpdated(res.data.data.lastUpdated);
        }
      })
      .catch((err) => console.warn('Using fallback refund policy:', err));
  }, []);

  return (
    <div className="refund-page">
      <div className="section" style={{ background: 'linear-gradient(170deg, #FAF0F2 0%, #FBF7EF 100%)', padding: '48px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-maroon font-display">Cancellation & Refund Policy</h1>
          <p className="text-muted" style={{ marginTop: '8px' }}>
            Last updated: {lastUpdated} • Transparent, devotee-friendly cancellation terms.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="card" style={{ padding: '40px', maxWidth: '840px', margin: '0 auto', lineHeight: 1.8, fontSize: '14px', color: 'var(--color-neutral-800)' }}>
          <div style={{ whiteSpace: 'pre-line', fontSize: '14px', color: 'var(--color-neutral-900)' }}>
            {refundPolicy}
          </div>

          <div style={{ marginTop: '30px', background: 'var(--color-sandal-100)', padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--color-maroon-900)', margin: '0 0 6px' }}>
              How to initiate a refund:
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-neutral-800)' }}>
              Devotees can cancel with 1-click in the <strong>My Bookings</strong> dashboard, or ping our WhatsApp support at <strong>+91 91483 91081</strong> with your PNR number.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
