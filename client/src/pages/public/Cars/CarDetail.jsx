import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarBySlug } from '../../../redux/slices/carSlice';
import { ROUTES } from '../../../constants/routes';
import { startBooking, setSelectedVehicle } from '../../../redux/slices/bookingSlice';
import styles from './Cars.module.css';

const CarDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCar: car, isLoading } = useSelector((state) => state.car);

  useEffect(() => {
    if (slug) dispatch(fetchCarBySlug(slug));
  }, [dispatch, slug]);

  const [tripType, setTripType] = useState('daily');

  const handleBookCab = () => {
    if (!car) return;
    dispatch(startBooking({
      type: 'car',
      itemId: car.id,
      itemSlug: car.slug,
      itemData: { ...car, selectedTripType: tripType },
    }));
    dispatch(setSelectedVehicle(car));
    navigate(ROUTES.TRAVELLER_DETAILS);
  };

  if (isLoading || !car) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="skeleton" style={{ width: '300px', height: '28px', margin: '0 auto 12px' }} />
        <div className="skeleton" style={{ width: '200px', height: '18px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="car-detail-page">
      <div className={styles.pageHeader}>
        <div className="container">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Link to={ROUTES.HOME} className="link-underline">Home</Link> /{' '}
            <Link to={ROUTES.CARS} className="link-underline">Cars</Link> /{' '}
            <span style={{ color: 'var(--color-maroon-900)' }}>{car.name}</span>
          </div>

          <span className="badge badge-maroon">{car.category}</span>
          <h1 className="text-maroon font-display" style={{ marginTop: '8px' }}>{car.name}</h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '8px auto 0' }}>
            {car.capacity} Capacity • Ghat-Road Certified Local Driver • 24/7 Available
          </p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {/* Left: Vehicle Specs & Driver Info */}
          <div>
            <div className="card" style={{ overflow: 'hidden', marginBottom: '24px' }}>
              <img src={car.thumbnail} alt={car.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-maroon-900)', marginBottom: '12px' }}>
                  Vehicle Highlights & Features
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-neutral-700)', marginBottom: '20px' }}>
                  {car.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  {car.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--color-neutral-800)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--color-sandal-100)', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '14px', color: 'var(--color-maroon-900)', marginBottom: '6px' }}>
                    👨‍✈️ Driver Qualifications
                  </h4>
                  <div style={{ fontSize: '13px', color: 'var(--color-neutral-700)' }}>
                    • <strong>Experience:</strong> {car.driverDetails.experienceYears}<br />
                    • <strong>Languages Spoken:</strong> {car.driverDetails.languages.join(', ')}<br />
                    • <strong>Security:</strong> Police background verified with commercial badge.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Pricing Calculator & Booking Widget */}
          <div>
            <div className="card" style={{ padding: '32px', position: 'sticky', top: '90px' }}>
              <span className="eyebrow">Instant Cab Booking</span>
              <h3 style={{ fontSize: '22px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '20px' }}>
                Select Your Pilgrimage Route
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1.5px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: tripType === 'daily' ? 'var(--color-gold-tint)' : 'transparent', borderColor: tripType === 'daily' ? 'var(--color-gold-600)' : 'var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="tripType" checked={tripType === 'daily'} onChange={() => setTripType('daily')} />
                    <div>
                      <strong>Tirupati & Tirumala Full Day</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Includes 7 Hills Ghat road, temple visits & parking</div>
                    </div>
                  </div>
                  <span className="price" style={{ fontSize: '18px' }}>₹{car.pricePerDay}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1.5px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: tripType === 'airport-tirupati' ? 'var(--color-gold-tint)' : 'transparent', borderColor: tripType === 'airport-tirupati' ? 'var(--color-gold-600)' : 'var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="tripType" checked={tripType === 'airport-tirupati'} onChange={() => setTripType('airport-tirupati')} />
                    <div>
                      <strong>Tirupati Airport (Renigunta) Transfer</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pickup/Drop to Hotel or Alipiri</div>
                    </div>
                  </div>
                  <span className="price" style={{ fontSize: '18px' }}>₹{car.airportPickupTirupati}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1.5px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: tripType === 'airport-chennai' ? 'var(--color-gold-tint)' : 'transparent', borderColor: tripType === 'airport-chennai' ? 'var(--color-gold-600)' : 'var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="tripType" checked={tripType === 'airport-chennai'} onChange={() => setTripType('airport-chennai')} />
                    <div>
                      <strong>Chennai Airport ⇄ Tirupati</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>One-way direct AC highway transfer</div>
                    </div>
                  </div>
                  <span className="price" style={{ fontSize: '18px' }}>₹{car.airportPickupChennai}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1.5px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', background: tripType === 'airport-bangalore' ? 'var(--color-gold-tint)' : 'transparent', borderColor: tripType === 'airport-bangalore' ? 'var(--color-gold-600)' : 'var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="tripType" checked={tripType === 'airport-bangalore'} onChange={() => setTripType('airport-bangalore')} />
                    <div>
                      <strong>Bengaluru ⇄ Tirupati</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>One-way direct AC highway transfer (250 km)</div>
                    </div>
                  </div>
                  <span className="price" style={{ fontSize: '18px' }}>₹{car.airportPickupBangalore}</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleBookCab}
                className="btn btn-gold btn-lg"
                style={{ width: '100%' }}
              >
                Proceed to Book Cab →
              </button>

              <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                ✓ No Advance Deposit Required • Pay Driver on Arrival or Pay Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
