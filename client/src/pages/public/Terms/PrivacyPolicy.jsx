import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const DEFAULT_PRIVACY = `1. Information We Collect
We collect personal information necessary to deliver travel services, including full names, contact telephone numbers, email addresses, residential cities, and ID proof types provided during checkout or enquiry.

2. Use of Information
Your information is strictly utilized to:
• Coordinate hotel check-ins and room allocations
• Dispatch driver and cab assignment SMS/WhatsApp notifications
• Provide emergency pilgrim assistance during your stay in Tirupati
• Send invoice receipts and booking vouchers

3. No Selling of Pilgrim Data
We uphold the highest standard of sanctity and privacy. Devotee contact information is never sold, traded, or shared with third-party telemarketers.

4. Payment Security
All online payment transactions are processed via RBI-authorized, PCI-DSS compliant payment gateways with 256-bit SSL encryption. We do not store credit card or debit card CVV/PIN credentials on our servers.`;

const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState(DEFAULT_PRIVACY);
  const [lastUpdated, setLastUpdated] = useState('September 2026');

  useEffect(() => {
    api.get('/terms')
      .then((res) => {
        if (res.data?.data?.privacyPolicy) {
          setPrivacyPolicy(res.data.data.privacyPolicy);
          if (res.data.data.lastUpdated) setLastUpdated(res.data.data.lastUpdated);
        }
      })
      .catch((err) => console.warn('Using fallback privacy policy:', err));
  }, []);

  return (
    <div className="privacy-page">
      <div className="section" style={{ background: 'linear-gradient(170deg, #FAF0F2 0%, #FBF7EF 100%)', padding: '48px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-maroon font-display">Privacy Policy</h1>
          <p className="text-muted" style={{ marginTop: '8px' }}>
            Last updated: {lastUpdated} • Your privacy and personal data are strictly protected.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="card" style={{ padding: '40px', maxWidth: '840px', margin: '0 auto', lineHeight: 1.8, fontSize: '14px', color: 'var(--color-neutral-800)' }}>
          <div style={{ whiteSpace: 'pre-line', fontSize: '14px', color: 'var(--color-neutral-900)' }}>
            {privacyPolicy}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
