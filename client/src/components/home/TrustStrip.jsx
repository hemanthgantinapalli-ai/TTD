import React from 'react';
import styles from './TrustStrip.module.css';

const TRUST_ITEMS = [
  {
    id: 1,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Verified Hotels',
    subtitle: 'Clean & Comfortable Stays',
  },
  {
    id: 2,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Experienced Drivers',
    subtitle: 'Safe & Reliable Travel',
  },
  {
    id: 3,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Dedicated Trip Assistance',
    subtitle: '24/7 Support',
  },
  {
    id: 4,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Transparent Pricing',
    subtitle: 'No Hidden Charges',
  },
];

const TrustStrip = () => (
  <div className={styles.strip} aria-label="Why trust TTD Yatra">
    <div className={styles.inner}>
      {TRUST_ITEMS.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.iconWrap} aria-hidden="true">
            {item.icon}
          </div>
          <div className={styles.text}>
            <strong className={styles.title}>{item.title}</strong>
            <span className={styles.subtitle}>{item.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TrustStrip;
