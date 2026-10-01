import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../common/Logo/Logo';
import { ROUTES } from '../../../constants/routes';
import styles from './Footer.module.css';

const EXPLORE_LINKS = [
  { label: 'Home',     to: ROUTES.HOME },
  { label: 'About Us', to: ROUTES.ABOUT },
  { label: 'Packages', to: ROUTES.PACKAGES },
  { label: 'Hotels',   to: ROUTES.HOTELS },
  { label: 'Cars',     to: ROUTES.CARS },
  { label: 'Blog',     to: ROUTES.BLOG },
  { label: 'Contact',  to: ROUTES.CONTACT },
];

const SERVICE_LINKS = [
  { label: 'Tirumala Yatra Packages', to: ROUTES.PACKAGES },
  { label: 'Hotels & Pilgrim Stays',   to: ROUTES.HOTELS },
  { label: 'Hill Fleet & Cab Rentals', to: ROUTES.CARS },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy',        to: ROUTES.PRIVACY_POLICY },
  { label: 'Terms of Service',       to: ROUTES.TERMS },
  { label: 'Refund & Cancellation',  to: ROUTES.REFUND_POLICY },
];

// Clean SVGs
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const ScrollToTopIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* 4-Column Grid */}
        <div className={styles.grid}>
          {/* Column 1: Brand */}
          <div className={styles.brandCol}>
            <Link to={ROUTES.HOME} aria-label="TTD Yatra Home" className={styles.logoLink}>
              <Logo size="md" variant="default" showWordmark />
            </Link>
            <p className={styles.brandDesc}>
              Hotels, car rentals and end-to-end trip assistance for your Tirumala–Tirupati pilgrimage. We handle the details so you can focus on the darshan.
            </p>
            <div className={styles.socialRow}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialBtn}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialBtn}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={styles.socialBtn}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="3" />
                  <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className={styles.navCol}>
            <h3 className={styles.colHeading}>EXPLORE</h3>
            <ul className={styles.linkList}>
              {EXPLORE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className={styles.navCol}>
            <h3 className={styles.colHeading}>SERVICES</h3>
            <ul className={styles.linkList}>
              {SERVICE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className={styles.contactCol}>
            <h3 className={styles.colHeading}>CONTACT</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true"><PhoneIcon /></span>
                <a href="tel:+918143311880" className={styles.contactLink}>
                  +91 8143311880
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true"><EmailIcon /></span>
                <a href="mailto:Sumanthdarsi@gmail.com" className={styles.contactLink}>
                  Sumanthdarsi@gmail.com
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true"><LocationIcon /></span>
                <span className={styles.contactText}>
                  Tirupati, Andhra Pradesh, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} TTD YATRA. All rights reserved.
          </p>

          <div className={styles.legalLinks}>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className={styles.legalLink}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top button */}
      <button
        type="button"
        onClick={handleScrollToTop}
        className={styles.scrollTopBtn}
        aria-label="Scroll to top of page"
        title="Scroll to Top"
      >
        <ScrollToTopIcon />
      </button>
    </footer>
  );
};

export default Footer;
