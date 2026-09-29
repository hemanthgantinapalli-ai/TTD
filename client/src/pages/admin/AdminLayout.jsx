import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Logo from '../../components/common/Logo/Logo';

const ADMIN_LINKS = [
  { label: 'Overview', to: ROUTES.ADMIN_DASHBOARD, icon: '📊' },
  { label: 'Terms & Policies', to: ROUTES.ADMIN_CMS, icon: '📜', highlight: true },
  { label: 'Bookings Ledger', to: ROUTES.ADMIN_BOOKINGS, icon: '🎟️' },
  { label: 'Yatra Packages', to: ROUTES.ADMIN_PACKAGES, icon: '📦' },
  { label: 'Hotels & Stays', to: ROUTES.ADMIN_HOTELS, icon: '🏨' },
  { label: 'Fleet & Cabs', to: ROUTES.ADMIN_CARS, icon: '🚗' },
  { label: 'Devotees & Users', to: ROUTES.ADMIN_USERS, icon: '👥' },
  { label: 'Inquiries & Leads', to: ROUTES.ADMIN_MARKETING, icon: '📩' },
  { label: 'Platform Settings', to: ROUTES.ADMIN_SETTINGS, icon: '⚙️' },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="admin-root" style={{ display: 'flex', minHeight: '100vh', background: '#F8F6F0', color: '#2B2320', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          background: 'linear-gradient(180deg, #320710 0%, #20040A 100%)',
          color: '#FAF0F2',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transform: isSidebarOpen ? 'translateX(0)' : 'none',
          transition: 'transform 0.3s ease',
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        }}
      >
        {/* Sidebar Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(227,192,92,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🕉️</span>
              <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '18px', letterSpacing: '1px', color: '#F2DEA2' }}>
                TTDYATRA
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#E3C05C', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '2px', fontWeight: 600 }}>
              Admin Control Center
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="mobile-only-btn"
            style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', padding: '8px 12px 4px', fontWeight: 600 }}>
            Master Controls
          </div>

          {ADMIN_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#4A0E1C' : '#E8DCDE',
                background: isActive ? 'linear-gradient(90deg, #F2DEA2 0%, #E3C05C 100%)' : (item.highlight ? 'rgba(227,192,92,0.1)' : 'transparent'),
                border: item.highlight && !isActive ? '1px dashed rgba(227,192,92,0.3)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.highlight && (
                <span style={{ fontSize: '9px', background: '#C9A227', color: '#320710', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
                  ALL TERMS
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer info */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E3C05C', color: '#4A0E1C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px' }}>
              SA
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#FDF6E3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Sri Venkateswara Admin
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                Master Access
              </div>
            </div>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <Link
              to={ROUTES.HOME}
              style={{
                flex: 1,
                padding: '6px 10px',
                fontSize: '11px',
                textAlign: 'center',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Public Site ↗
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Bar */}
        <header
          style={{
            height: '64px',
            background: '#FFFFFF',
            borderBottom: '1px solid #E5DFD5',
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 80,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '6px 10px',
                cursor: 'pointer',
              }}
              className="mobile-hamburger-btn"
            >
              ☰
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2E7D46', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#2E7D46', background: '#EBF5EF', padding: '3px 8px', borderRadius: '12px' }}>
                System Online • DB Connected
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              to={ROUTES.ADMIN_CMS}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #FAF0F2 0%, #F3DEE2 100%)',
                color: '#4A0E1C',
                border: '1px solid #8C2A3B',
                fontSize: '12.5px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>📜</span> Edit Terms & Policies
            </Link>

            <Link
              to={ROUTES.HOME}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: '#4A0E1C',
                color: '#F2DEA2',
                fontSize: '12.5px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(74,14,28,0.2)',
              }}
            >
              <span>👁️</span> View Live Site
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '28px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          aside {
            transform: translateX(-100%) !important;
          }
          div[style*="marginLeft: '280px'"] {
            margin-left: 0 !important;
          }
          .mobile-hamburger-btn {
            display: inline-block !important;
          }
          .mobile-only-btn {
            display: inline-block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
