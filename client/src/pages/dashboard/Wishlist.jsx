import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PACKAGES, MOCK_HOTELS } from '../../data/mockData';
import { ROUTES } from '../../constants/routes';

const Wishlist = () => {
  const savedHotels = MOCK_HOTELS.slice(0, 2);
  const savedPackages = MOCK_PACKAGES.slice(0, 1);

  return (
    <div className="card" style={{ padding: '32px' }}>
      <span className="eyebrow">Saved For Later</span>
      <h1 style={{ fontSize: '24px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '24px' }}>
        Wishlist & Shortlisted Yatras
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '12px' }}>
            Saved Pilgrimage Packages
          </h3>
          {savedPackages.map((pkg) => (
            <div key={pkg.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-sandal-100)', marginBottom: '12px' }}>
              <div>
                <strong style={{ fontSize: '16px', color: 'var(--color-maroon-900)' }}>{pkg.title}</strong>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{pkg.duration} • ₹{pkg.startingPrice}</div>
              </div>
              <Link to={ROUTES.PACKAGE_DETAIL(pkg.slug)} className="btn btn-gold btn-sm">
                Book Now →
              </Link>
            </div>
          ))}
        </div>

        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '12px' }}>
            Saved Hotels
          </h3>
          {savedHotels.map((hotel) => (
            <div key={hotel.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-sandal-100)', marginBottom: '12px' }}>
              <div>
                <strong style={{ fontSize: '16px', color: 'var(--color-maroon-900)' }}>{hotel.name}</strong>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>📍 {hotel.location} • ₹{hotel.pricePerNight} / night</div>
              </div>
              <Link to={ROUTES.HOTEL_DETAIL(hotel.slug)} className="btn btn-gold btn-sm">
                View Rooms →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
