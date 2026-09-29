import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { APP_CONFIG } from '../../../config/appConfig';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dates: '',
    passengers: '2',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please provide your name and phone number');
      return;
    }
    setIsSubmitted(true);
    toast.success('Your pilgrimage enquiry has been submitted! Our coordinator will call you shortly.');
  };

  return (
    <div className="contact-page">
      <div className="section" style={{ background: 'linear-gradient(170deg, #FAF0F2 0%, #FBF7EF 100%)', padding: '56px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <span className="eyebrow">We Are Here to Assist You</span>
          <h1 className="text-maroon font-display" style={{ marginTop: '8px' }}>
            Contact TTD Yatra
          </h1>
          <p className="text-muted" style={{ maxWidth: '650px', margin: '8px auto 0' }}>
            Reach out to our Tirupati travel desk for bookings, customized family itineraries, or darshan inquiries.
          </p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          {/* Contact Details */}
          <div>
            <span className="eyebrow">Get In Touch</span>
            <h2 className="text-maroon" style={{ fontSize: '26px', marginTop: '8px', marginBottom: '20px' }}>
              Tirupati Pilgrim Help Desk
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
              <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px' }}>📞</div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Call Helpline (24/7)</div>
                  <a href={`tel:${APP_CONFIG.contact.phoneRaw}`} style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-maroon-900)' }}>
                    {APP_CONFIG.contact.phone}
                  </a>
                </div>
              </div>

              <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px' }}>💬</div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Instant WhatsApp Chat</div>
                  <a
                    href={APP_CONFIG.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '16px', fontWeight: 600, color: '#25D366' }}
                  >
                    +91 91483 91081 (Click to Chat)
                  </a>
                </div>
              </div>

              <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px' }}>✉️</div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email Enquiries</div>
                  <a href={`mailto:${APP_CONFIG.contact.email}`} style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-maroon-900)' }}>
                    {APP_CONFIG.contact.email}
                  </a>
                </div>
              </div>

              <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px' }}>📍</div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Office Address</div>
                  <div style={{ fontSize: '14px', color: 'var(--color-neutral-800)', fontWeight: 500 }}>
                    Alipiri Bypass Road, Near Srinivasam Complex, Tirupati, Andhra Pradesh - 517501
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div>
            <div className="card" style={{ padding: '36px' }}>
              <span className="eyebrow">Plan Your Yatra</span>
              <h3 style={{ fontSize: '22px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '20px' }}>
                Send Custom Pilgrimage Request
              </h3>

              {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--color-success-bg)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🙏</div>
                  <h4 style={{ color: 'var(--color-success)', fontSize: '20px', marginBottom: '8px' }}>
                    Govinda! Enquiry Received
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--color-neutral-800)' }}>
                    Our pilgrim coordinator is reviewing your details and will call / WhatsApp you on <strong>{formData.phone}</strong> shortly with complete options.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: '20px' }}
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Ramesh Sharma"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                        Mobile Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        className="input"
                        placeholder="10-digit mobile"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="input"
                        placeholder="name@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                        Expected Travel Date
                      </label>
                      <input
                        type="date"
                        className="input"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.dates}
                        onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                        No. of Devotees
                      </label>
                      <select
                        className="input"
                        value={formData.passengers}
                        onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="4">4 Persons (Family)</option>
                        <option value="6">6+ Persons (Group)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                      Special Requirements (e.g. Senior Citizen, Wheelchair, Pick up airport)
                    </label>
                    <textarea
                      className="input"
                      rows="3"
                      placeholder="Tell us what you need (Stay + Cab + Temples to cover)..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      style={{ minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '8px' }}>
                    Submit Enquiry →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
