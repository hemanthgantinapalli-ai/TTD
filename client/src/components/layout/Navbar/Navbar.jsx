import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../../common/Logo/Logo';
import { ROUTES } from '../../../constants/routes';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Services', to: ROUTES.SERVICES },
  { label: 'Packages', to: ROUTES.PACKAGES },
  { label: 'Hotels', to: ROUTES.HOTELS },
  { label: 'Cars', to: ROUTES.CARS },
  { label: 'About', to: ROUTES.ABOUT },
  { label: 'Contact', to: ROUTES.CONTACT },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileOpen(false);
      }
    };
    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  // Trap focus in mobile menu
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <a href="#main-content" className="skip-nav">Skip to main content</a>

      <header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link to={ROUTES.HOME} className={styles.logoLink} aria-label="TTDYATRA — Home">
            <Logo size="md" variant="default" showWordmark />
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `link-underline ${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className={styles.desktopActions}>
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(74, 14, 28, 0.08)',
                color: 'var(--color-maroon-900)',
                border: '1px solid rgba(74, 14, 28, 0.2)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>⚙️</span> Admin Portal
            </Link>

            {user ? (
              <div className={styles.userMenu}>
                <Link to={ROUTES.DASHBOARD} className="btn btn-outline btn-sm">
                  My Trips
                </Link>
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm">
                  Sign In
                </Link>
                <Link to={ROUTES.CONTACT} className="btn btn-gold btn-sm">
                  Enquire Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
          >
            <span className={`${styles.hamburgerLine} ${isMobileOpen ? styles.line1Open : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMobileOpen ? styles.line2Open : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMobileOpen ? styles.line3Open : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div
            className={styles.mobileOverlay}
            aria-hidden="true"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        <nav
          id="mobile-menu"
          ref={menuRef}
          className={`${styles.mobileMenu} ${isMobileOpen ? styles.mobileMenuOpen : ''}`}
          aria-label="Mobile navigation"
          aria-hidden={!isMobileOpen}
        >
          <div className={styles.mobileMenuInner}>
            <div className={styles.mobileMenuHeader}>
              <Logo size="sm" variant="default" showWordmark />
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ul className={styles.mobileNavList} role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
                    }
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className={styles.mobileActions}>
              <Link to={ROUTES.ADMIN_DASHBOARD} className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--color-maroon-900)', color: 'var(--color-maroon-900)', fontWeight: 600 }}>
                ⚙️ Admin Portal (All Terms & Controls)
              </Link>
              {user ? (
                <Link to={ROUTES.DASHBOARD} className="btn btn-maroon" style={{ width: '100%' }}>
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="btn btn-outline" style={{ width: '100%' }}>
                    Sign In
                  </Link>
                  <Link to={ROUTES.REGISTER} className="btn btn-gold" style={{ width: '100%' }}>
                    Create Account
                  </Link>
                </>
              )}
              <a
                href="https://wa.me/919148391081"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ width: '100%', color: '#25D366' }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z" />
                  <path d="M9.2 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.6 1.4c.1.2 0 .4-.1.6l-.5.5c-.1.2-.2.3 0 .6a6 6 0 0 0 2.4 2.1c.3.2.4.1.6 0l.6-.7c.2-.2.3-.2.6-.1l1.3.7c.2.1.3.2.3.3 0 .5-.6 1.4-1 1.5-.7.3-1.6.3-3.6-.7a9 9 0 0 1-3.4-3.4c-.7-1.4-.5-2.3-.2-2.9z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
