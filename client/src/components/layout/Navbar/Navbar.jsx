import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../../common/Logo/Logo';
import { ROUTES } from '../../../constants/routes';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Home',     to: ROUTES.HOME },
  { label: 'Packages', to: ROUTES.PACKAGES },
  { label: 'Hotels',   to: ROUTES.HOTELS },
  { label: 'Cars',     to: ROUTES.CARS },
  { label: 'About',    to: ROUTES.ABOUT },
  { label: 'Contact',  to: ROUTES.CONTACT },
];

/* Search icon SVG */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

/* Heart / Wishlist icon */
const WishlistIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location   = useLocation();
  const menuRef    = useRef(null);
  const { user }   = useSelector((state) => state.auth);

  /* Scroll listener for subtle elevation change */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileOpen(false);
      }
    };
    if (isMobileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const headerClass = [
    styles.header,
    isScrolled ? styles.scrolled : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <a href="#main-content" className="skip-nav">Skip to main content</a>

      <header className={headerClass} role="banner">
        <div className={styles.inner}>

          {/* ── Logo ──────────────────────────────────────── */}
          <Link to={ROUTES.HOME} className={styles.logoLink} aria-label="TTDYATRA — Home">
            <Logo
              size="md"
              variant="white"
              showWordmark
            />
          </Link>

          {/* ── Desktop Nav ──────────────────────────────── */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop Actions ──────────────────────────── */}
          <div className={styles.desktopActions}>
            {/* Search */}
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Search"
              onClick={() => {/* future: open search modal */}}
            >
              <SearchIcon />
            </button>

            {/* Wishlist */}
            <Link
              to={user ? ROUTES.DASHBOARD_WISHLIST : ROUTES.LOGIN}
              className={styles.iconBtn}
              aria-label="Wishlist"
            >
              <WishlistIcon />
            </Link>

            {user ? (
              <div className={styles.userMenu}>
                <Link to={ROUTES.DASHBOARD} className={styles.loginBtn}>
                  My Trips
                </Link>
                <Link to={ROUTES.PACKAGES} className={styles.bookBtn}>
                  Book Now
                </Link>
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link to={ROUTES.LOGIN} className={styles.loginBtn}>
                  Login / Register
                </Link>
                <Link to={ROUTES.PACKAGES} className={styles.bookBtn}>
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Hamburger ─────────────────────────── */}
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

        {/* ── Mobile Overlay ──────────────────────────────── */}
        {isMobileOpen && (
          <div
            className={styles.mobileOverlay}
            aria-hidden="true"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* ── Mobile Menu drawer ──────────────────────────── */}
        <nav
          id="mobile-menu"
          ref={menuRef}
          className={`${styles.mobileMenu} ${isMobileOpen ? styles.mobileMenuOpen : ''}`}
          aria-label="Mobile navigation"
          aria-hidden={!isMobileOpen}
        >
          <div className={styles.mobileMenuInner}>
            <div className={styles.mobileMenuHeader}>
              <Logo size="sm" variant="white" showWordmark />
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
              {user ? (
                <Link to={ROUTES.DASHBOARD} className="btn btn-outline" style={{ width: '100%' }}>
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="btn btn-outline" style={{ width: '100%' }}>
                    Login / Register
                  </Link>
                  <Link to={ROUTES.PACKAGES} className="btn btn-gold" style={{ width: '100%' }}>
                    Book Now
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
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
