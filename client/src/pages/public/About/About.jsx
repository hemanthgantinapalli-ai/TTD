import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { APP_CONFIG } from '../../../config/appConfig';
import PageHeader from '../../../components/common/PageHeader/PageHeader';

const About = () => {
  return (
    <div className="about-page">
      <PageHeader
        eyebrow="ABOUT TTD YATRA"
        title="YOUR PILGRIMAGE JOURNEY, ARRANGED WITH CARE"
        subtitle="Learn more about our pilgrimage travel services and local support."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'About' },
        ]}
      />

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center', marginBottom: '64px' }}>
          <div>
            <span className="eyebrow">Serving Srivari Devotees</span>
            <h2 className="text-maroon" style={{ fontSize: '28px', marginTop: '8px', marginBottom: '16px' }}>
              Born from a Devotional Vision in the Holy City of Tirupati
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--color-neutral-700)', marginBottom: '16px' }}>
              Millions of pilgrims journey from every corner of India and across the world to behold the supreme beauty of Lord Venkateswara atop the sacred Seven Hills of Tirumala.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--color-neutral-700)', marginBottom: '24px' }}>
              Too often, families face confusion regarding transport on the ghat road, hotel hygiene, dress codes, and queue tokens. TTD Yatra was founded to eliminate these hassles through local expertise, compassionate service, and complete transparency.
            </p>

            <div className="flex gap-4">
              <Link to={ROUTES.PACKAGES} className="btn btn-gold">
                View Pilgrimage Packages
              </Link>
              <Link to={ROUTES.CONTACT} className="btn btn-outline">
                Contact Our Team
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: '32px', background: 'var(--color-cream)', border: '1.5px solid var(--color-gold-400)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--color-maroon-900)', marginBottom: '16px' }}>
              Our Devotee-First Principles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <strong style={{ color: 'var(--color-maroon-900)' }}>1. Absolute Transparency</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  No hidden charges, surge fares, or misleading promises. All rates and inclusions are published upfront.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-maroon-900)' }}>2. Safe & Compassionate Transit</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  We hire only hill-licensed, non-smoking, sober drivers who respect elderly pilgrims and drive safely on ghats.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-maroon-900)' }}>3. Pure Sattvic Standards</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  We partner only with clean hotels that provide pure vegetarian meals and peaceful spiritual atmosphere.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div style={{ background: 'var(--color-gold-tint)', border: '1px solid var(--color-gold-400)', padding: '20px 24px', borderRadius: '12px', fontSize: '13px', color: 'var(--color-neutral-800)', lineHeight: 1.6 }}>
          <strong>Important Notice:</strong> {APP_CONFIG.disclaimer} We provide premium travel, accommodation, and advisory services to assist pilgrims. Official darshan tickets are issued directly by TTD on their official portal.
        </div>
      </div>
    </div>
  );
};

export default About;
