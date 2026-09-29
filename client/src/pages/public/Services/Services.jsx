import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const Services = () => {
  return (
    <div className="services-page">
      <div className="section" style={{ background: 'linear-gradient(170deg, #FAF0F2 0%, #FBF7EF 100%)', padding: '56px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <span className="eyebrow">Complete Pilgrimage Solutions</span>
          <h1 className="text-maroon font-display" style={{ marginTop: '8px' }}>
            Our Pilgrimage Services
          </h1>
          <p className="text-muted" style={{ maxWidth: '650px', margin: '8px auto 0' }}>
            Every component of your Tirumala-Tirupati yatra organized with reverence, punctuality, and comfort.
          </p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          <div id="hotels" className="card" style={{ padding: '32px' }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>🏨</div>
            <h2 style={{ fontSize: '20px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
              Hotel Stays & Cottages
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Verified 3-star to 5-star pure vegetarian hotels, family quad rooms, and hilltop cottages with 24-hr hot water and temple shuttle facilities.
            </p>
            <Link to={ROUTES.HOTELS} className="btn btn-outline btn-sm">
              Explore Hotels →
            </Link>
          </div>

          <div id="cars" className="card" style={{ padding: '32px' }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>🚗</div>
            <h2 style={{ fontSize: '20px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
              Car Rentals & Airport Transfers
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Sedans, Innova Crysta, Fortuner, and 12-seater Tempo Travellers with hill-certified drivers for ghat road climbs and inter-city temple travel.
            </p>
            <Link to={ROUTES.CARS} className="btn btn-outline btn-sm">
              View Cab Fleet →
            </Link>
          </div>

          <div id="packages" className="card" style={{ padding: '32px' }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>✨</div>
            <h2 style={{ fontSize: '20px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
              All-Inclusive Yatra Packages
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Complete packages combining stay, cab, sightseeing to Kanipakam, Sri Kalahasti, and Padmavathi temple, with devotee assistance.
            </p>
            <Link to={ROUTES.PACKAGES} className="btn btn-outline btn-sm">
              View Packages →
            </Link>
          </div>

          <div id="assistance" className="card" style={{ padding: '32px' }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>🧭</div>
            <h2 style={{ fontSize: '20px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
              Darshan Guide & Senior Care
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Dedicated wheelchair support, token counter routing, tonsure (kalyanakatta) assistance, and official dress code verification.
            </p>
            <Link to={ROUTES.DARSHAN_GUIDE} className="btn btn-outline btn-sm">
              Read Darshan Guide →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
