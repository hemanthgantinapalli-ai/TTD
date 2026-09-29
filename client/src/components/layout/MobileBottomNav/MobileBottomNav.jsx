import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../../constants/routes';
import { APP_CONFIG } from '../../../config/appConfig';
import styles from './MobileBottomNav.module.css';

// Icons
const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const ExploreIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M15.6 8.4l-1.8 5.4-5.4 1.8 1.8-5.4z" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const BookingsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M9 9h6M9 13h6M9 17h4" />
  </svg>
);

const SupportIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4l3 3" />
  </svg>
);

const ProfileIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const NAV_ITEMS = [
  { label: 'Home', to: ROUTES.HOME, Icon: HomeIcon, exact: true },
  { label: 'Explore', to: ROUTES.PACKAGES, Icon: ExploreIcon },
  { label: 'Bookings', to: ROUTES.DASHBOARD_BOOKINGS, Icon: BookingsIcon, requireAuth: true },
  { label: 'Support', to: ROUTES.CONTACT, Icon: SupportIcon },
  { label: 'Profile', to: ROUTES.DASHBOARD_PROFILE, Icon: ProfileIcon, requireAuth: true },
];

const MobileBottomNav = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <nav className={styles.nav} aria-label="Mobile navigation" role="navigation">
        {NAV_ITEMS.map(({ label, to, Icon, exact, requireAuth }) => {
          // For auth-required items, redirect to login if not logged in
          const destination = requireAuth && !user ? ROUTES.LOGIN : to;

          return (
            <NavLink
              key={label}
              to={destination}
              end={exact}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <span className={styles.iconWrap}>
                    <Icon active={isActive} />
                    {/* Badge for notifications example */}
                    {label === 'Bookings' && user && (
                      <span className={styles.badge} aria-label="notifications" />
                    )}
                  </span>
                  <span className={styles.label}>{label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* WhatsApp FAB */}
      <a
        href={APP_CONFIG.contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappFab}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z" />
          <path d="M9.2 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.6 1.4c.1.2 0 .4-.1.6l-.5.5c-.1.2-.2.3 0 .6a6 6 0 0 0 2.4 2.1c.3.2.4.1.6 0l.6-.7c.2-.2.3-.2.6-.1l1.3.7c.2.1.3.2.3.3 0 .5-.6 1.4-1 1.5-.7.3-1.6.3-3.6-.7a9 9 0 0 1-3.4-3.4c-.7-1.4-.5-2.3-.2-2.9z" />
        </svg>
      </a>
    </>
  );
};

export default MobileBottomNav;
