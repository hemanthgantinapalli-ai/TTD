import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Logo from '../../common/Logo/Logo';
import { ROUTES } from '../../../constants/routes';
import { APP_CONFIG } from '../../../config/appConfig';
import { clearCredentials, logout } from '../../../redux/slices/authSlice';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Home',     to: ROUTES.HOME },
  { label: 'Packages', to: ROUTES.PACKAGES },
  { label: 'Hotels',   to: ROUTES.HOTELS },
  { label: 'Cars',     to: ROUTES.CARS },
  { label: 'About Us', to: ROUTES.ABOUT },
  { label: 'Blog',     to: ROUTES.BLOG },
  { label: 'Contact',  to: ROUTES.CONTACT },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location   = useLocation();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const menuRef    = useRef(null);
  const profileRef = useRef(null);
  const { user }   = useSelector((state) => state.auth);

  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email ? user.email[0].toUpperCase() : 'U');

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch {
      // ignore
    }
    dispatch(clearCredentials());
    setIsProfileOpen(false);
    navigate(ROUTES.HOME);
  };

  /* Scroll listener for subtle elevation change */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu and profile menu on route change */
  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  /* Close menus on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const isLinkActive = (linkTo) => {
    if (linkTo === ROUTES.HOME) {
      return location.pathname === '/';
    }
    if (linkTo === ROUTES.BLOG || linkTo === '/blog') {
      return (
        location.pathname === '/blog' ||
        location.pathname.startsWith('/blog/') ||
        location.pathname === '/blogs' ||
        location.pathname.startsWith('/blogs/')
      );
    }
    return location.pathname === linkTo || location.pathname.startsWith(`${linkTo}/`);
  };

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
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.to);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* ── Desktop Actions ──────────────────────────── */}
          <div className={styles.desktopActions}>
            {/* My Trips */}
            <Link
              to={user ? ROUTES.DASHBOARD_BOOKINGS : ROUTES.LOGIN}
              className={styles.myTripsLink}
            >
              My Trips
            </Link>

            {/* Profile Dropdown if logged in, otherwise Login */}
            {user ? (
              <div className={styles.profileMenuWrap} ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={styles.profileTriggerBtn}
                  aria-expanded={isProfileOpen}
                  aria-label="Devotee Profile Menu"
                >
                  <div className={styles.profileAvatar}>
                    {initials}
                  </div>
                  <span className={styles.profileName}>
                    {user.name ? user.name.split(' ')[0] : 'Profile'}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className={styles.profileDropdown}>
                    {/* User Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '14px', borderBottom: '1px solid #F0E8DE' }}>
                      <div className={styles.profileAvatar} style={{ width: '42px', height: '42px', fontSize: '15px' }}>
                        {initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#3B0A17', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name || 'Devotee Pilgrim'}
                        </div>
                        <span style={{
                          display: 'inline-block',
                          marginTop: '3px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          background: user.role === 'admin' ? '#FDF2F4' : '#E8F5EE',
                          color: user.role === 'admin' ? '#8C2A3B' : '#2E7D46',
                        }}>
                          {user.role === 'admin' ? 'Sri Venkateswara Admin' : 'Devotee Account'}
                        </span>
                      </div>
                    </div>

                    {/* User Info Details */}
                    <div style={{ padding: '12px 0', borderBottom: '1px solid #F0E8DE', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B615C' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C2A3B" strokeWidth="2">
                          <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>
                        </svg>
                        <span style={{ color: '#2B2320', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email || 'Email not linked'}</span>
                      </div>
                      {user.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B615C' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C2A3B" strokeWidth="2">
                            <path d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
                          </svg>
                          <span style={{ color: '#2B2320' }}>{user.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Navigation Links */}
                    <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Link
                        to={ROUTES.DASHBOARD_BOOKINGS}
                        onClick={() => setIsProfileOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 10px', borderRadius: '7px',
                          fontSize: '13px', fontWeight: 600, color: '#3B0A17',
                          textDecoration: 'none', transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#FAF8F5'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        My Bookings &amp; Yatra Trips
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to={ROUTES.ADMIN_DASHBOARD}
                          onClick={() => setIsProfileOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 10px', borderRadius: '7px',
                            fontSize: '13px', fontWeight: 600, color: '#8C2A3B',
                            textDecoration: 'none', transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#FDF2F4'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                          </svg>
                          Admin Control Center
                        </Link>
                      )}
                    </div>

                    {/* Logout Button */}
                    <div style={{ paddingTop: '8px', borderTop: '1px solid #F0E8DE' }}>
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'transparent',
                          border: '1px solid #EAE0D5',
                          color: '#C0392B',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FDF2F4';
                          e.currentTarget.style.borderColor = '#E3514F';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = '#EAE0D5';
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to={ROUTES.LOGIN} className={styles.loginBtn}>
                Login
              </Link>
            )}

            {/* Book Now */}
            <Link to={ROUTES.PACKAGES} className={styles.bookBtn}>
              Book Now
            </Link>
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
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.to);
                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={`${styles.mobileNavLink} ${active ? styles.mobileNavLinkActive : ''}`}
                      end={link.to === '/'}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Separator */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)', margin: '14px 0' }} />

            <div className={styles.mobileActions}>
              {user ? (
                <>
                  <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', width: '100%', boxSizing: 'border-box', textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#F2DEA2' }}>{user.name || 'Devotee Pilgrim'}</div>
                    <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{user.email}</div>
                  </div>
                  <Link to={ROUTES.DASHBOARD_BOOKINGS} className="btn btn-outline" style={{ width: '100%' }} onClick={() => setIsMobileOpen(false)}>
                    My Trips &amp; Bookings
                  </Link>
                  <Link to={ROUTES.PACKAGES} className="btn btn-gold" style={{ width: '100%' }} onClick={() => setIsMobileOpen(false)}>
                    Book Now
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', color: '#E3514F' }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.DASHBOARD_BOOKINGS} className="btn btn-outline" style={{ width: '100%' }} onClick={() => setIsMobileOpen(false)}>
                    My Trips
                  </Link>
                  <Link to={ROUTES.LOGIN} className="btn btn-outline" style={{ width: '100%' }} onClick={() => setIsMobileOpen(false)}>
                    Login
                  </Link>
                  <Link to={ROUTES.PACKAGES} className="btn btn-gold" style={{ width: '100%' }} onClick={() => setIsMobileOpen(false)}>
                    Book Now
                  </Link>
                </>
              )}
              <a
                href={APP_CONFIG.contact.whatsapp}
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
