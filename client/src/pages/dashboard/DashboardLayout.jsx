import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ROUTES } from '../../constants/routes';
import { logout } from '../../redux/slices/authSlice';
import { toggleElderMode } from '../../redux/slices/uiSlice';
import Logo from '../../components/common/Logo/Logo';
import PageHeader from '../../components/common/PageHeader/PageHeader';

const DASHBOARD_NAV = [
  { label: '🧳 My Bookings', to: ROUTES.DASHBOARD_BOOKINGS },
  { label: '📅 Upcoming Trips', to: ROUTES.DASHBOARD_UPCOMING },
  { label: '💳 Payment History', to: ROUTES.DASHBOARD_PAYMENTS },
  { label: '❤️ Saved Wishlist', to: ROUTES.DASHBOARD_WISHLIST },
  { label: '👤 Devotee Profile', to: ROUTES.DASHBOARD_PROFILE },
  { label: '🎧 Pilgrim Helpline & Support', to: ROUTES.DASHBOARD_SUPPORT },
];

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { elderMode } = useSelector((state) => state.ui);

  return (
    <div className="dashboard-page" style={{ minHeight: '90vh', background: 'var(--bg-page)' }}>
      <PageHeader
        eyebrow="DEVOTEE PORTAL"
        title="MY TRIPS & PILGRIMAGE BOOKINGS"
        subtitle="Review and manage your confirmed yatra itineraries, hotel reservations, and download vouchers."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'My Trips' },
        ]}
      />
      <div className="container" style={{ padding: '36px 16px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
          {/* Left Navigation Sidebar */}
          <aside className="card" style={{ padding: '24px', height: 'fit-content', background: 'var(--bg-paper)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-maroon-900)', color: 'var(--color-gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                {user?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--color-maroon-900)' }}>
                  {user?.name || 'Devotee Guest'}
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {user?.phone || 'Pilgrim Member'}
                </div>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {DASHBOARD_NAV.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `btn btn-sm ${isActive ? 'btn-gold' : 'btn-ghost'}`
                  }
                  style={{ justifyContent: 'flex-start', textAlign: 'left', width: '100%' }}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Elder Mode Toggle */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px', color: 'var(--color-maroon-900)', fontWeight: 600 }}>
                <span>👓 Elder Reading Mode</span>
                <input
                  type="checkbox"
                  checked={elderMode}
                  onChange={() => dispatch(toggleElderMode())}
                  style={{ accentColor: 'var(--color-maroon-900)', width: '16px', height: '16px' }}
                />
              </label>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Larger fonts & high contrast for seniors.
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => dispatch(logout())}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
              >
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Dashboard Content Area */}
          <main style={{ flex: 1 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
