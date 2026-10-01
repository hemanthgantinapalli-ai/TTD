import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_DARSHAN_GUIDES } from '../../../data/mockData';
import { ROUTES } from '../../../constants/routes';
import PageHeader from '../../../components/common/PageHeader/PageHeader';

const DarshanGuide = () => {
  const [selectedAudience, setSelectedAudience] = useState('men');

  return (
    <div className="darshan-guide-page">
      <PageHeader
        eyebrow="OFFICIAL PROTOCOLS & DEVOTEE ADVISORY"
        title="TIRUMALA DARSHAN & PILGRIM GUIDE"
        subtitle="Essential dress codes, darshan quota booking rules, laddu prasadam collection, and special senior citizen entry steps."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Darshan Guide' },
        ]}
      />

      <div className="container section">
        {/* Interactive Dress Code Checker */}
        <div className="card" style={{ padding: '32px', marginBottom: '40px', border: '1.5px solid var(--color-gold-400)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-maroon">Vedic Dress Code Verification</span>
              <h2 style={{ fontSize: '22px', color: 'var(--color-maroon-900)', marginTop: '4px' }}>
                What Should You Wear for Srivari Darshan?
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${selectedAudience === 'men' ? 'btn-maroon' : 'btn-outline'}`}
                onClick={() => setSelectedAudience('men')}
              >
                Men Devotees
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedAudience === 'women' ? 'btn-maroon' : 'btn-outline'}`}
                onClick={() => setSelectedAudience('women')}
              >
                Women Devotees
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedAudience === 'kids' ? 'btn-maroon' : 'btn-outline'}`}
                onClick={() => setSelectedAudience('kids')}
              >
                Children
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid rgba(46, 125, 70, 0.25)', padding: '20px', borderRadius: '10px' }}>
              <h3 style={{ color: 'var(--color-success)', fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✅</span> Permitted Attire
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-neutral-800)' }}>
                {selectedAudience === 'men' && 'White Dhoti (Veshti/Pancha) with Uttariyam/Angavastram, or Kurta Pyjama in modest light colours. Traditional North Indian Kurta with Churidar/Dhoti is fully accepted.'}
                {selectedAudience === 'women' && 'Traditional Saree with blouse, Half-Saree (Pavadai), or Churidar / Salwar Kameez with Dupatta properly pinned across both shoulders.'}
                {selectedAudience === 'kids' && 'Traditional Pattu Pavadai, Dhoti-Kurta, or modest ethnic Indian clothing.'}
              </p>
            </div>

            <div style={{ background: 'var(--color-error-bg)', border: '1px solid rgba(179, 38, 30, 0.25)', padding: '20px', borderRadius: '10px' }}>
              <h3 style={{ color: 'var(--color-error)', fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🚫</span> Strictly Prohibited
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-neutral-800)' }}>
                {selectedAudience === 'men' && 'Jeans, T-shirts, shorts, track pants, bermudas, lungis, caps, hats, and lungis with printed patterns are rejected at Vaikuntam scanning.'}
                {selectedAudience === 'women' && 'Western skirts, jeans, sleeveless tops, short kurtis, leggings without long dupatta, and bodycon dresses are strictly stopped at the entry gates.'}
                {selectedAudience === 'kids' && 'Beachwear or night pyjamas.'}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Guide Categories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {MOCK_DARSHAN_GUIDES.map((guide) => (
            <div key={guide.id} className="card" style={{ padding: '28px' }}>
              <span className="badge badge-gold" style={{ marginBottom: '10px' }}>{guide.category}</span>
              <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
                {guide.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                {guide.summary}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {guide.points.map((pt, i) => (
                  <div key={i} style={{ background: 'var(--color-sandal-100)', padding: '12px 14px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-maroon-900)', marginBottom: '4px' }}>
                      {pt.name || pt.audience}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-neutral-700)', lineHeight: 1.5 }}>
                      {pt.details || `${pt.allowed} (${pt.prohibited})`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Assistance Callout */}
        <div className="card" style={{ padding: '32px', textAlign: 'center', marginTop: '48px', background: 'var(--color-cream)' }}>
          <h2 style={{ fontSize: '22px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
            Need Personalized Assistance for Your Darshan Planning?
          </h2>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
            Speak with our Tirupati pilgrim coordinator for real-time queue status, accommodation recommendations, and private cab bookings.
          </p>
          <div className="flex justify-center gap-4">
            <Link to={ROUTES.PACKAGES} className="btn btn-gold">
              Explore Pilgrimage Packages
            </Link>
            <a
              href="https://wa.me/918143311880"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ color: '#25D366', borderColor: '#25D366' }}
            >
              WhatsApp Pilgrim Coordinator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarshanGuide;
