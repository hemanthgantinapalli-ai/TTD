import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { ROUTES } from '../../constants/routes';
import { Link } from 'react-router-dom';

const DEFAULT_TERMS = {
  lastUpdated: 'September 2026',
  disclaimer: 'TTDYATRA is a premier independent devotional travel facilitator and concierge. We are NOT affiliated with, authorized by, or an agent of Tirumala Tirupati Devasthanams (TTD). All official darshan tokens, pooja sevas, and laddus are governed exclusively by TTD rules.',
  termsOfService: `1. Acceptance of Terms
By accessing or using the TTD Yatra platform (website, mobile interfaces, or phone booking desk), you agree to be bound by these Terms of Service. If you do not agree, please refrain from booking or accessing our services.

2. Scope of Services
TTDYATRA provides pilgrim travel assistance, including hill-certified private cab rentals, curated vegetarian hotel accommodations, certified guide coordination, and step-by-step darshan reporting advisory. We do not sell or alter official TTD tickets.

3. Pilgrim Identification & Documentation
All devotees, including children above 12 years of age, must carry valid government-issued original photo ID proofs (Aadhaar Card, Indian Passport, or Voter ID). The names on travel bookings and hotel room allocations must match official identity credentials.

4. Sacred Temple Code of Conduct
Pilgrims utilizing our transportation, stay, and guide services are strictly required to observe traditional Vedic decorum, including mandatory temple dress codes (Dhoti/Kurta or Pyjama with Angavastram for men; Saree or Half-Saree or Chudidar with Dupatta for women). Western wear (jeans, shorts, sleeveless, mini-skirts) is prohibited in the sanctum sanctorum.

5. Ghat Road Safety & Transit Timing
Transit on Tirumala Hill Ghat Road is strictly monitored by TTD automated speed cameras. Minimum travel time between Alipiri Toll Gate and Tirumala is 28 minutes for safety compliance. Our certified chauffeurs are strictly instructed never to overspeed or stop unlawfully in tiger corridor zones.

6. Limitation of Liability
TTDYATRA shall not be held liable for sudden changes in TTD darshan queue timings, VIP protocol halts, temple closures, or natural weather advisories beyond our reasonable logistical control.`,

  privacyPolicy: `1. Information We Collect
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
All online payment transactions are processed via RBI-authorized, PCI-DSS compliant payment gateways with 256-bit SSL encryption. We do not store credit card or debit card CVV/PIN credentials on our servers.`,

  refundPolicy: `1. Free Cancellation Window
Devotees may cancel hotel or vehicle reservations up to 24 hours prior to the scheduled pickup or check-in time for a 100% full refund with ZERO cancellation charges.

2. Standard Cancellation (< 24 Hours)
For cancellations made within 24 hours of scheduled arrival or service commencement, a nominal 10% administrative processing fee will be retained, and 90% of the total amount will be refunded.

3. Emergency & Train / Flight Delay Protection
If your arrival in Tirupati is delayed or cancelled due to certified train or airline cancellations, we allow complimentary rescheduling to any available date within 90 days, or an 85% immediate refund upon verification.

4. Refund Disbursement Timelines
Approved refunds are initiated within 2 business hours and reflect in the original payment bank account or UPI handle within 3 to 5 business days, subject to the issuing bank's clearing cycle.`,

  ghatRoadRules: `• Alipiri Toll Gate opens at 03:00 AM and closes at 12:00 Midnight.
• Downhill Ghat Road opens at 03:00 AM and closes at 12:00 Midnight.
• Minimum transit time limit of 28 minutes on Up-ghat road and 40 minutes on Down-ghat road must be maintained to avoid automatic fines.
• Two-wheelers are permitted only between 04:00 AM and 08:00 PM.
• Carrying alcohol, tobacco, non-vegetarian food, or plastics onto the sacred hills is strictly forbidden and punishable by law.`,

  announcementBanner: {
    enabled: true,
    text: '🕉️ TTD Special Entry Darshan (₹300) Quota releases on 24th Oct 10:00 AM IST. Pre-book your sanitized cab & stay with zero cancellation charges!',
    badge: 'Important Update'
  }
};

const AdminTerms = () => {
  const [termsData, setTermsData] = useState(DEFAULT_TERMS);
  const [activeTab, setActiveTab] = useState('terms');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const res = await adminService.getTerms();
      if (res?.data) {
        setTermsData(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch remote terms, using local fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminService.updateTerms(termsData);
      toast.success('Terms and policies updated successfully! Changes are live on public site.');
    } catch (err) {
      toast.error('Failed to update terms: ' + (err.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all terms and policies to TTD Yatra standard defaults?')) {
      setTermsData(DEFAULT_TERMS);
      toast('Restored to default guidelines. Click Save to publish.');
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📜</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#4A0E1C', margin: 0, fontFamily: 'Cinzel, serif' }}>
              Terms & Policies Management
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B615C', marginTop: '6px' }}>
            Full administrative control over Terms of Service, Privacy Policy, Refund Rules, Ghat Regulations, and Live Announcement Banners.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleReset}
            type="button"
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid #D8CBB8',
              background: '#fff',
              color: '#6B615C',
              cursor: 'pointer',
            }}
          >
            Reset Defaults
          </button>

          <Link
            to={ROUTES.TERMS}
            target="_blank"
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid #C9A227',
              background: '#FFF8E6',
              color: '#8C6B10',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Preview Live Public Page ↗
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            type="button"
            style={{
              padding: '8px 20px',
              fontSize: '13px',
              borderRadius: '6px',
              border: 'none',
              background: 'linear-gradient(135deg, #4A0E1C 0%, #611626 100%)',
              color: '#F2DEA2',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(74,14,28,0.25)',
            }}
          >
            {saving ? 'Saving...' : '💾 Save & Publish All Terms'}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ background: '#FFFBF0', border: '1px solid #F2DEA2', padding: '12px 18px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', color: '#8C6B10' }}>
        <div>
          <strong>Active Version:</strong> {termsData.lastUpdated || 'September 2026'} • All updates sync immediately with consumer public checkout & footer links.
        </div>
        <div style={{ fontWeight: 600 }}>
          🔒 Full Admin Editing Enabled
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '2px solid #E0D4C0', marginBottom: '24px', overflowX: 'auto' }}>
        {[
          { id: 'terms', label: 'Terms of Service', icon: '📜' },
          { id: 'privacy', label: 'Privacy Policy', icon: '🛡️' },
          { id: 'refund', label: 'Refund & Cancellation', icon: '💳' },
          { id: 'ghat', label: 'Ghat Road & Safety Rules', icon: '⛰️' },
          { id: 'banner', label: 'Announcement Ticker', icon: '📢' },
          { id: 'disclaimer', label: 'Service Disclaimer', icon: '⚖️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
            style={{
              padding: '10px 16px',
              fontSize: '13.5px',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#4A0E1C' : '#6B615C',
              background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
              border: activeTab === tab.id ? '1px solid #E0D4C0' : '1px solid transparent',
              borderBottom: activeTab === tab.id ? '2px solid #FFFFFF' : 'none',
              marginBottom: '-2px',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E0D4C0', borderRadius: '0 8px 8px 8px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
        {/* Tab: Terms of Service */}
        {activeTab === 'terms' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: 0 }}>
                Devotee Terms of Service Agreement
              </h2>
              <p style={{ fontSize: '13px', color: '#6B615C', marginTop: '4px' }}>
                Defines the contractual relationship between TTD Yatra and booking pilgrims.
              </p>
            </div>
            <textarea
              rows={16}
              value={termsData.termsOfService || ''}
              onChange={(e) => setTermsData({ ...termsData, termsOfService: e.target.value })}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '13.5px',
                lineHeight: 1.7,
                border: '1px solid #D8CBB8',
                borderRadius: '8px',
                background: '#FEFCF7',
                color: '#2B2320',
                fontFamily: 'Consolas, monospace',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>
        )}

        {/* Tab: Privacy Policy */}
        {activeTab === 'privacy' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: 0 }}>
                Pilgrim Privacy & Data Security Policy
              </h2>
              <p style={{ fontSize: '13px', color: '#6B615C', marginTop: '4px' }}>
                Describes what information is gathered for booking confirmation and guarantees against data sharing.
              </p>
            </div>
            <textarea
              rows={14}
              value={termsData.privacyPolicy || ''}
              onChange={(e) => setTermsData({ ...termsData, privacyPolicy: e.target.value })}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '13.5px',
                lineHeight: 1.7,
                border: '1px solid #D8CBB8',
                borderRadius: '8px',
                background: '#FEFCF7',
                color: '#2B2320',
                fontFamily: 'Consolas, monospace',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>
        )}

        {/* Tab: Refund Policy */}
        {activeTab === 'refund' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: 0 }}>
                Cancellation & Refund Protection Terms
              </h2>
              <p style={{ fontSize: '13px', color: '#6B615C', marginTop: '4px' }}>
                Clear, pilgrim-first refund guidelines (100% refund up to 24h prior to check-in/pickup).
              </p>
            </div>
            <textarea
              rows={14}
              value={termsData.refundPolicy || ''}
              onChange={(e) => setTermsData({ ...termsData, refundPolicy: e.target.value })}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '13.5px',
                lineHeight: 1.7,
                border: '1px solid #D8CBB8',
                borderRadius: '8px',
                background: '#FEFCF7',
                color: '#2B2320',
                fontFamily: 'Consolas, monospace',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>
        )}

        {/* Tab: Ghat Road Rules */}
        {activeTab === 'ghat' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: 0 }}>
                Tirumala Ghat Road Safety & Forest Compliance Rules
              </h2>
              <p style={{ fontSize: '13px', color: '#6B615C', marginTop: '4px' }}>
                Speed governor restrictions, toll gate timings (3 AM – 12 Midnight), and plastic prohibitions.
              </p>
            </div>
            <textarea
              rows={12}
              value={termsData.ghatRoadRules || ''}
              onChange={(e) => setTermsData({ ...termsData, ghatRoadRules: e.target.value })}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '13.5px',
                lineHeight: 1.7,
                border: '1px solid #D8CBB8',
                borderRadius: '8px',
                background: '#FEFCF7',
                color: '#2B2320',
                fontFamily: 'Consolas, monospace',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>
        )}

        {/* Tab: Announcement Banner */}
        {activeTab === 'banner' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: 0 }}>
                Live Devotee Announcement & TTD Quota Alert
              </h2>
              <p style={{ fontSize: '13px', color: '#6B615C', marginTop: '4px' }}>
                This ticker is displayed across the top of the public website for high-priority updates.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#4A0E1C' }}>
                <input
                  type="checkbox"
                  checked={termsData.announcementBanner?.enabled ?? true}
                  onChange={(e) =>
                    setTermsData({
                      ...termsData,
                      announcementBanner: {
                        ...termsData.announcementBanner,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  style={{ width: '18px', height: '18px', accentColor: '#4A0E1C' }}
                />
                Enable Announcement Banner on Public Header
              </label>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A3F3A', marginBottom: '6px' }}>
                  Badge Tag (e.g., Important Update, Quota Alert)
                </label>
                <input
                  type="text"
                  value={termsData.announcementBanner?.badge || ''}
                  onChange={(e) =>
                    setTermsData({
                      ...termsData,
                      announcementBanner: {
                        ...termsData.announcementBanner,
                        badge: e.target.value,
                      },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13.5px',
                    border: '1px solid #D8CBB8',
                    borderRadius: '6px',
                    background: '#FEFCF7',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A3F3A', marginBottom: '6px' }}>
                  Announcement Text
                </label>
                <textarea
                  rows={4}
                  value={termsData.announcementBanner?.text || ''}
                  onChange={(e) =>
                    setTermsData({
                      ...termsData,
                      announcementBanner: {
                        ...termsData.announcementBanner,
                        text: e.target.value,
                      },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    border: '1px solid #D8CBB8',
                    borderRadius: '6px',
                    background: '#FEFCF7',
                  }}
                />
              </div>

              {/* Live Preview Box */}
              <div style={{ marginTop: '12px', padding: '14px', background: '#320710', borderRadius: '8px', color: '#FAF0F2' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#E3C05C', marginBottom: '8px', fontWeight: 600 }}>
                  Banner Live Preview:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <span style={{ background: '#C9A227', color: '#320710', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                    {termsData.announcementBanner?.badge || 'Update'}
                  </span>
                  <span>{termsData.announcementBanner?.text || 'Announcement preview here...'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Disclaimer */}
        {activeTab === 'disclaimer' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#4A0E1C', margin: 0 }}>
                Mandatory Regulatory Disclaimer
              </h2>
              <p style={{ fontSize: '13px', color: '#6B615C', marginTop: '4px' }}>
                Required legal clarification regarding non-affiliation with Tirumala Tirupati Devasthanams (TTD) administration.
              </p>
            </div>
            <textarea
              rows={6}
              value={termsData.disclaimer || ''}
              onChange={(e) => setTermsData({ ...termsData, disclaimer: e.target.value })}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '13.5px',
                lineHeight: 1.7,
                border: '1px solid #D8CBB8',
                borderRadius: '8px',
                background: '#FEFCF7',
                color: '#2B2320',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* Save Bar at bottom */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #E0D4C0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            type="button"
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              borderRadius: '6px',
              border: 'none',
              background: 'linear-gradient(135deg, #4A0E1C 0%, #611626 100%)',
              color: '#F2DEA2',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(74,14,28,0.2)',
            }}
          >
            {saving ? 'Saving...' : '💾 Save & Publish All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTerms;
