import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { APP_CONFIG } from '../../../config/appConfig';
import styles from './TripAssistance.module.css';

const TripAssistance = () => {
  return (
    <div className="trip-assistance-page">
      <div className={styles.headerSection}>
        <div className="container">
          <span className="eyebrow">End-to-End Pilgrimage Concierge</span>
          <h1 className={`font-display ${styles.title}`}>
            Personalized Tirumala Trip Assistance
          </h1>
          <p className={styles.subtitle}>
            Let our local coordinators handle your stay, vehicle, pickup, queue timing and yatra itinerary seamlessly.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🕉️</div>
            <h3 className={styles.cardTitle}>
              Darshan Guidance & Timetable
            </h3>
            <p className={styles.cardDesc}>
              We advise on optimal slot timings, free SSD token counter locations, reporting checkpoints, and step-by-step entry procedures.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}>👵</div>
            <h3 className={styles.cardTitle}>
              Senior Citizen & Differently-Abled Care
            </h3>
            <p className={styles.cardDesc}>
              Special wheelchair coordination, low step-in AC vehicles, elevator-access hotel rooms, and gentle travel pace for family elders.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}>🚗</div>
            <h3 className={styles.cardTitle}>
              Airport & Station Chauffeur
            </h3>
            <p className={styles.cardDesc}>
              Punctual pickups from Chennai, Bangalore, and Renigunta airports or Tirupati station with nameboards and luggage assistance.
            </p>
          </div>
        </div>

        {/* Action card */}
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>
            Have a custom family pilgrimage requirement?
          </h2>
          <p className={styles.ctaDesc}>
            Tell us your travel dates, group size, and special preferences. We will curate a customized plan within 30 minutes.
          </p>
          <div className={styles.buttonGroup}>
            <Link to={ROUTES.CONTACT} className="btn btn-gold btn-lg">
              Submit Custom Inquiry
            </Link>
            <a
              href={APP_CONFIG.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
              style={{ color: 'var(--color-white)', borderColor: 'var(--color-gold-400)' }}
            >
              Direct WhatsApp ({APP_CONFIG.contact.phone})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripAssistance;
