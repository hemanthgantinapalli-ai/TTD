import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const DEFAULT_TERMS = `1. Acceptance of Terms
By accessing or using the TTD Yatra platform, you agree to be bound by these Terms of Service.

2. Scope of Services
TTDYATRA provides pilgrim travel assistance, including hill-certified private cab rentals, curated vegetarian hotel accommodations, certified guide coordination, and step-by-step darshan reporting advisory. We do not sell or alter official TTD tickets.

3. Pilgrim Identification & Documentation
All devotees, including children above 12 years of age, must carry valid government-issued original photo ID proofs (Aadhaar Card, Indian Passport, or Voter ID).

4. Sacred Temple Code of Conduct
Pilgrims utilizing our transportation, stay, and guide services are strictly required to observe traditional Vedic decorum, including mandatory temple dress codes (Dhoti/Kurta for men; Saree or Chudidar for women).

5. Ghat Road Safety & Transit Timing
Transit on Tirumala Hill Ghat Road is strictly monitored by TTD automated speed cameras. Minimum travel time between Alipiri Toll Gate and Tirumala is 28 minutes for safety compliance.

6. Limitation of Liability
TTDYATRA shall not be held liable for sudden changes in TTD darshan queue timings, VIP protocol halts, temple closures, or natural weather advisories beyond our reasonable logistical control.`;

const Terms = () => {
  const [termsData, setTermsData] = useState({
    termsOfService: DEFAULT_TERMS,
    lastUpdated: 'September 2026',
    disclaimer: 'TTDYATRA is an independent private travel agency and booking platform. We are NOT affiliated with, endorsed by, or operated by Tirumala Tirupati Devasthanams (TTD). Official darshan tickets are issued by TTD directly.',
    ghatRoadRules: '• Minimum transit time of 28 minutes on Up-ghat road must be maintained to avoid automatic fines.\n• Two-wheelers permitted only between 4:00 AM and 8:00 PM.\n• Plastic, alcohol, and non-veg food are strictly prohibited on Tirumala hills.',
  });

  useEffect(() => {
    api.get('/terms')
      .then((res) => {
        if (res.data?.data) {
          setTermsData(res.data.data);
        }
      })
      .catch((err) => console.warn('Using local terms fallback:', err));
  }, []);

  return (
    <div className="terms-page">
      <div className="section" style={{ background: 'linear-gradient(170deg, #FAF0F2 0%, #FBF7EF 100%)', padding: '48px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-maroon font-display">Terms of Service</h1>
          <p className="text-muted" style={{ marginTop: '8px' }}>
            Last updated: {termsData.lastUpdated || 'September 2026'}
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="card" style={{ padding: '40px', maxWidth: '840px', margin: '0 auto', lineHeight: 1.8, fontSize: '14px', color: 'var(--color-neutral-800)' }}>
          {/* Statutory Disclaimer Alert */}
          <div style={{ background: '#FFF8E6', border: '1px solid #F2DEA2', borderRadius: '8px', padding: '16px 20px', marginBottom: '28px', color: '#8C6B10', fontSize: '13px' }}>
            <strong>Official Pilgrim Notice:</strong> {termsData.disclaimer}
          </div>

          <div style={{ whiteSpace: 'pre-line', fontSize: '14px', color: 'var(--color-neutral-900)' }}>
            {termsData.termsOfService}
          </div>

          {termsData.ghatRoadRules && (
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '12px' }}>
                ⛰️ Tirumala Ghat Road Safety Guidelines
              </h2>
              <div style={{ background: 'var(--color-sandal-100)', padding: '16px 20px', borderRadius: '8px', whiteSpace: 'pre-line', fontSize: '13px' }}>
                {termsData.ghatRoadRules}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terms;
