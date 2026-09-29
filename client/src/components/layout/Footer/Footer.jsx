import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../common/Logo/Logo';
import { ROUTES } from '../../../constants/routes';
import { APP_CONFIG } from '../../../config/appConfig';
import styles from './Footer.module.css';

const EXPLORE_LINKS = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Services', to: ROUTES.SERVICES },
  { label: 'Packages', to: ROUTES.PACKAGES },
  { label: 'About', to: ROUTES.ABOUT },
  { label: 'Contact', to: ROUTES.CONTACT },
  { label: 'Blog', to: ROUTES.BLOGS },
];

const SERVICE_LINKS = [
  { label: 'Hotels & Stays', to: `${ROUTES.SERVICES}#hotels` },
  { label: 'Car Rentals', to: `${ROUTES.SERVICES}#cars` },
  { label: 'Trip Assistance', to: `${ROUTES.SERVICES}#assistance` },
  { label: 'Trip Packages', to: ROUTES.PACKAGES },
  { label: 'Darshan Guide', to: ROUTES.DARSHAN_GUIDE },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: ROUTES.PRIVACY_POLICY },
  { label: 'Refund Policy', to: ROUTES.REFUND_POLICY },
  { label: 'Terms of Service', to: ROUTES.TERMS },
];

// Icons as inline SVG components for zero dependency
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z" />
    <path d="M9.2 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.6 1.4c.1.2 0 .4-.1.6l-.5.5c-.1.2-.2.3 0 .6a6 6 0 0 0 2.4 2.1c.3.2.4.1.6 0l.6-.7c.2-.2.3-.2.6-.1l1.3.7c.2.1.3.2.3.3 0 .5-.6 1.4-1 1.5-.7.3-1.6.3-3.6-.7a9 9 0 0 1-3.4-3.4c-.7-1.4-.5-2.3-.2-2.9z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const GopuramDivider = () => (
  <div className={styles.gopuramDivider} aria-hidden="true">
    <span className={styles.dividerLine} />
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="3.2" r="1.3" fill="currentColor" stroke="none" />
      <path d="M16 4.6V7" />
      <path d="M11 8.5q5-4 10 0" />
      <path d="M10.5 8.5h11l-1.5 5h-8z" />
      <path d="M9 13.5h14l-2 6H11z" />
      <path d="M7.5 19.5h17l-2 6h-13z" />
      <path d="M6 25.5h20v3H6z" />
      <path d="M4 28.5h24" />
    </svg>
    <span className={styles.dividerLine} />
  </div>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Newsletter CTA */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaWatermark} aria-hidden="true">
              <svg viewBox="0 0 240 160" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round">
                <circle cx="120" cy="13" r="3" />
                <path d="M120 16v9" />
                <path d="M104 40q16-20 32 0" />
                <path d="M101 40h38l-5 18h-28z" />
                <path d="M96 58h48l-6 22h-36z" />
                <path d="M90 80h60l-7 26h-46z" />
                <path d="M82 106h76l-8 34H90z" />
                <path d="M112 140v-20q8-8 16 0v20" />
                <path d="M28 140h184" />
              </svg>
            </div>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Planning a darshan trip?</h2>
              <p className={styles.ctaDesc}>
                Tell us your dates and group — we'll put together the right stay, cab and itinerary for you.
              </p>
              <div className={styles.ctaActions}>
                <Link to={ROUTES.CONTACT} className="btn btn-gold">
                  Enquire Now
                </Link>
                <a href={`tel:${APP_CONFIG.contact.phoneRaw}`} className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--color-white)' }}>
                  Call {APP_CONFIG.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand column */}
            <div className={styles.brandCol}>
              <Link to={ROUTES.HOME} aria-label="TTDYATRA Home">
                <Logo size="md" variant="default" showWordmark />
              </Link>
              <p className={styles.tagline}>
                Hotels, car rentals and end-to-end trip assistance for your Tirumala–Tirupati pilgrimage.
                We handle the details so you can focus on the darshan.
              </p>
              <div className={styles.socialLinks}>
                <a href="#" aria-label="Facebook" className={styles.socialLink}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="#" aria-label="Instagram" className={styles.socialLink}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="#" aria-label="YouTube" className={styles.socialLink}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="3" />
                    <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Explore links */}
            <div className={styles.linkCol}>
              <h3 className={styles.colTitle}>Explore</h3>
              <ul className={styles.linkList}>
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className={styles.linkCol}>
              <h3 className={styles.colTitle}>Services</h3>
              <ul className={styles.linkList}>
                {SERVICE_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.linkCol}>
              <h3 className={styles.colTitle}>Contact</h3>
              <ul className={styles.contactList}>
                <li>
                  <a href={`tel:${APP_CONFIG.contact.phoneRaw}`} className={styles.contactItem}>
                    <span className={styles.contactIcon}><PhoneIcon /></span>
                    {APP_CONFIG.contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={APP_CONFIG.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactItem}
                  >
                    <span className={styles.contactIcon}><WhatsAppIcon /></span>
                    WhatsApp Us
                  </a>
                </li>
                <li>
                  <a href={`mailto:${APP_CONFIG.contact.email}`} className={styles.contactItem}>
                    <span className={styles.contactIcon}><EmailIcon /></span>
                    {APP_CONFIG.contact.email}
                  </a>
                </li>
                <li className={styles.contactItem}>
                  <span className={styles.contactIcon}><PinIcon /></span>
                  <span>{APP_CONFIG.contact.address}</span>
                </li>
              </ul>

              {/* Legal */}
              <div className={styles.legalLinks}>
                {LEGAL_LINKS.map((link) => (
                  <Link key={link.to} to={link.to} className={styles.legalLink}>
                    {link.label}
                  </Link>
                ))}
                <Link to={ROUTES.ADMIN_DASHBOARD} className={styles.legalLink} style={{ color: 'var(--color-gold-400)', fontWeight: 600 }}>
                  ⚙️ Admin Portal
                </Link>
              </div>
            </div>
          </div>

          <GopuramDivider />

          {/* Bottom bar */}
          <div className={styles.bottomBar}>
            <p className={styles.copyright}>
              © {year} TTDYATRA. All rights reserved.
            </p>
            <p className={styles.disclaimer}>
              {APP_CONFIG.disclaimer}{' '}
              <a
                href={APP_CONFIG.official_ttd_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ttdLink}
              >
                Official TTD →
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
