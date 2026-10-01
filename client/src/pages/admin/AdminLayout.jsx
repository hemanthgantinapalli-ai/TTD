import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, logout } from '../../redux/slices/authSlice';
import { ROUTES } from '../../constants/routes';
import officialLogo from '../../assets/images/logo/ttd-yatra-logo.png';
import AdminNotifications from './AdminNotifications';

const NAV_ICONS = {
  dashboard: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  terms:     (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
  bookings:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a2 2 0 0 1 0-4h20a2 2 0 0 1 0 4v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9z"/></svg>,
  packages:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10"/><path d="M23 7l-11-5L1 7l11 5 11-5z"/><line x1="12" y1="22" x2="12" y2="12"/></svg>,
  hotels:    (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  cars:      (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><rect x="5" y="13" width="14" height="8" rx="2"/><circle cx="7.5" cy="21" r="1.5" fill="currentColor" stroke="none"/><circle cx="16.5" cy="21" r="1.5" fill="currentColor" stroke="none"/></svg>,
  users:     (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  leads:     (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  payments:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  settings:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

const ADMIN_LINKS = [
  { label: 'Dashboard',            to: ROUTES.ADMIN_DASHBOARD, navIcon: 'dashboard' },
  { label: 'Payment Verification', to: ROUTES.ADMIN_PAYMENTS,  navIcon: 'payments'  },
  { label: 'Bookings Ledger',      to: ROUTES.ADMIN_BOOKINGS,  navIcon: 'bookings'  },
  { label: 'Terms & Policies',     to: ROUTES.ADMIN_CMS,       navIcon: 'terms'     },
  { label: 'Yatra Packages',       to: ROUTES.ADMIN_PACKAGES,  navIcon: 'packages'  },
  { label: 'Hotels & Stays',       to: ROUTES.ADMIN_HOTELS,    navIcon: 'hotels'    },
  { label: 'Fleet & Cabs',         to: ROUTES.ADMIN_CARS,      navIcon: 'cars'      },
  { label: 'Devotees & Users',     to: ROUTES.ADMIN_USERS,     navIcon: 'users'     },
  { label: 'Inquiries & Leads',    to: ROUTES.ADMIN_MARKETING, navIcon: 'leads'     },
  { label: 'Platform Settings',    to: ROUTES.ADMIN_SETTINGS,  navIcon: 'settings'  },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const adminName = user?.name || user?.email || 'Administrator';
  const initials = adminName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch {
      // The client session is cleared even if the server logout request fails.
    }
    dispatch(clearCredentials());
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  };

  return (
    <div className="admin-root" style={{ display: 'flex', minHeight: '100vh', background: '#F5F0EB', color: '#2B2320', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={isSidebarOpen ? 'sidebar-open' : ''}
        style={{
          width: '240px',
          background: 'linear-gradient(180deg, #3B0A17 0%, #1A0308 100%)',
          color: '#FAF0F2',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transition: 'transform 0.3s ease',
          boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
        }}
      >
        {/* Sidebar Brand Header */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(227,192,92,0.18)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to={ROUTES.ADMIN_DASHBOARD} onClick={() => setIsSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flex: 1, minWidth: 0 }}>
            <img
              src={officialLogo}
              alt="TTD Yatra Official Logo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                objectFit: 'cover',
                flexShrink: 0,
                border: '1.5px solid rgba(242, 222, 162, 0.45)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px', color: '#F2DEA2', lineHeight: 1.15 }}>TTD YATRA</div>
              <div style={{ fontSize: '9px', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '3px', fontWeight: 600 }}>Admin Portal</div>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="mobile-only-btn"
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#F2DEA2',
              fontSize: '18px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '6px 10px',
              borderRadius: '6px',
            }}
            aria-label="Close sidebar"
          >✕</button>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {ADMIN_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.ADMIN_DASHBOARD}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item${isActive ? ' active' : ''}`
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#3B0A17' : '#D8CCD0',
                background: isActive ? 'linear-gradient(90deg, #F2DEA2 0%, #E3C05C 100%)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                letterSpacing: '0.1px',
              })}
            >
              <span style={{ width: '18px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
                {NAV_ICONS[item.navIcon] ? NAV_ICONS[item.navIcon](16) : null}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.22)', textAlign: 'center' }}>
          <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
            <img
              src={officialLogo}
              alt="TTD Yatra"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                objectFit: 'contain',
                opacity: 0.85,
              }}
            />
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '11.5px', color: '#F2DEA2', letterSpacing: '0.5px' }}>TTD YATRA</div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Sacred Journeys, Seamless Travel</div>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="admin-main-wrap">
        {/* Top Header */}
        <header className="admin-header" style={{
          height: '60px',
          background: '#FFFFFF',
          borderBottom: '1px solid #EAE2D8',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 80,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mobile-hamburger-btn"
              style={{
                display: 'none',
                background: '#FAF8F5',
                border: '1.5px solid #EAE0D5',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#3B0A17',
                lineHeight: 1,
              }}
              aria-label="Toggle navigation menu"
            >☰</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <img
                src={officialLogo}
                alt="TTD Yatra Official Logo"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '7px',
                  objectFit: 'cover',
                  border: '1px solid #EAE2D8',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div className="admin-header-title" style={{ fontWeight: 700, fontSize: '13.5px', color: '#2B2320', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin Control Center</div>
                <div className="admin-header-subtitle" style={{ fontSize: '10.5px', color: '#9A8580', marginTop: '2px', whiteSpace: 'nowrap' }}>Sri Venkateswara Admin Portal</div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Real Professional Notification Center */}
            <AdminNotifications />

            {/* Divider */}
            <div className="admin-header-divider" style={{ width: '1px', height: '24px', background: '#E5DFD5' }} />

            {/* Admin avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{
                width: '32px', height: '32px',
                background: 'linear-gradient(135deg, #4A0E1C, #8C2A3B)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#F2DEA2', fontWeight: 700, fontSize: '11px',
                border: '2px solid #E3C05C',
                flexShrink: 0,
              }}>{initials}</div>
              <div className="admin-user-details" style={{ lineHeight: 1.25 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#2B2320', whiteSpace: 'nowrap' }}>Admin Desk</div>
                <div style={{ fontSize: '10px', color: '#9A8580' }}>Master</div>
              </div>
            </div>

            {/* View Live Site */}
            <Link
              to={ROUTES.HOME}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '7px 11px',
                borderRadius: '7px',
                background: '#2B0A12',
                color: '#F2DEA2',
                fontSize: '11.5px',
                fontWeight: 600,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(43,10,18,0.25)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="admin-view-live-text">View Site</span>
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                background: 'transparent',
                border: '1px solid #D8CBB8',
                color: '#6B615C',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >Logout</button>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content" style={{ flex: 1, padding: '28px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;500;600;700;800&display=swap');
        
        .admin-main-wrap {
          margin-left: 240px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          transition: margin-left 0.3s ease;
        }

        @media (max-width: 992px) {
          aside {
            transform: translateX(-100%);
          }
          aside.sidebar-open {
            transform: translateX(0) !important;
          }
          .admin-main-wrap {
            margin-left: 0 !important;
          }
          .mobile-hamburger-btn {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
          }
          .mobile-only-btn {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
          }
          .admin-header {
            padding: 0 14px !important;
          }
          .admin-content {
            padding: 16px 12px !important;
          }
          .admin-header-subtitle {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .admin-user-details {
            display: none !important;
          }
          .admin-view-live-text {
            display: none !important;
          }
          .admin-header-title {
            font-size: 12px !important;
          }
          .admin-header-divider {
            display: none !important;
          }
        }

        .admin-nav-item:hover:not(.active) {
          background: rgba(255,255,255,0.07) !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
