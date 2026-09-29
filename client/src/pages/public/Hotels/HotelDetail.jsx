import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelBySlug } from '../../../redux/slices/hotelSlice';
import { ROUTES } from '../../../constants/routes';
import { startBooking, setSelectedRoom } from '../../../redux/slices/bookingSlice';
import styles from './Hotels.module.css';

const HotelDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedHotel: hotel, isLoading } = useSelector((state) => state.hotel);

  useEffect(() => {
    if (slug) dispatch(fetchHotelBySlug(slug));
  }, [dispatch, slug]);

  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    if (hotel?.rooms?.length) setSelectedRoomId(hotel.rooms[0].id);
  }, [hotel]);

  const handleBookRoom = (room) => {
    dispatch(startBooking({
      type: 'hotel',
      itemId: hotel.id,
      itemSlug: hotel.slug,
      itemData: hotel,
    }));
    dispatch(setSelectedRoom(room));
    navigate(ROUTES.TRAVELLER_DETAILS);
  };

  if (isLoading || !hotel) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="skeleton" style={{ width: '300px', height: '28px', margin: '0 auto 12px' }} />
        <div className="skeleton" style={{ width: '200px', height: '18px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="hotel-detail-page">
      {/* Breadcrumb & Title */}
      <div className={styles.detailHeader}>
        <div className="container">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Link to={ROUTES.HOME} className="link-underline">Home</Link> /{' '}
            <Link to={ROUTES.HOTELS} className="link-underline">Hotels</Link> /{' '}
            <span style={{ color: 'var(--color-maroon-900)' }}>{hotel.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
                <span className="badge badge-maroon">{hotel.category}</span>
                {hotel.vegOnly && <span className="badge badge-success">🌿 100% Pure Veg</span>}
                <span style={{ color: 'var(--color-gold-700)', fontWeight: 600, fontSize: '14px' }}>
                  ★ {hotel.reviewRating} ({hotel.reviewCount} devotee reviews)
                </span>
              </div>
              <h1 className="text-maroon font-display" style={{ fontSize: '28px' }}>{hotel.name}</h1>
              <p className="text-muted" style={{ fontSize: '14px', marginTop: '4px' }}>📍 {hotel.address}</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)', textTransform: 'uppercase' }}>
                Starting price
              </span>
              <div className="flex items-center gap-2">
                <span className="price" style={{ fontSize: '28px' }}>₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
                <span className="price-original">₹{hotel.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>per night (excl. taxes)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container section">
        {/* Photo Gallery */}
        <div className={styles.galleryGrid}>
          <img src={hotel.images[0] || hotel.thumbnail} alt={hotel.name} className={styles.galleryMain} />
          <div className={styles.galleryThumbCol}>
            <img src={hotel.images[1] || hotel.thumbnail} alt={`${hotel.name} view 2`} className={styles.galleryThumb} />
            <img src={hotel.images[2] || hotel.thumbnail} alt={`${hotel.name} view 3`} className={styles.galleryThumb} />
          </div>
        </div>

        {/* Proximity & Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '12px' }}>
              About this Stay
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--color-neutral-700)' }}>
              {hotel.description}
            </p>

            <h4 style={{ fontSize: '15px', color: 'var(--color-maroon-900)', marginTop: '20px', marginBottom: '10px' }}>
              Transit & Temple Proximity
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
              <div>🚂 Railway Station: <strong>{hotel.proximity.railwayStation}</strong></div>
              <div>✈️ Tirupati Airport: <strong>{hotel.proximity.airport}</strong></div>
              <div>⛩️ Alipiri Toll Gate: <strong>{hotel.proximity.alipiriTollGate}</strong></div>
              <div>🚌 Central Bus Stand: <strong>{hotel.proximity.busStand}</strong></div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '16px' }}>
              Amenities & Pilgrim Services
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {hotel.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--color-neutral-800)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Room Types */}
        <div className={styles.roomsSection}>
          <div style={{ marginBottom: '24px' }}>
            <span className="eyebrow">Select Your Accommodation</span>
            <h2 style={{ fontSize: '24px', color: 'var(--color-maroon-900)', marginTop: '4px' }}>
              Available Room Categories
            </h2>
          </div>

          {hotel.rooms?.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <div
                key={room.id}
                className={`${styles.roomCard} ${isSelected ? styles.roomCardSelected : ''}`}
              >
                <img src={room.image} alt={room.name} className={styles.roomImg} />

                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)' }}>{room.name}</h3>
                    <span className="badge badge-gold">{room.size}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    🛏️ {room.bedType} • Max {room.maxGuests} Devotees
                  </p>

                  <div className={styles.roomFeatures}>
                    {room.features.map((feat, i) => (
                      <div key={i} className={styles.roomFeatureItem}>
                        <span>✓</span> {feat}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="flex items-center justify-center gap-2" style={{ marginBottom: '8px' }}>
                    <span className="price">₹{room.price.toLocaleString('en-IN')}</span>
                    <span className="price-original">₹{room.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    per night + taxes
                  </span>

                  <button
                    type="button"
                    onClick={() => handleBookRoom(room)}
                    className="btn btn-gold"
                    style={{ width: '100%' }}
                  >
                    Book This Room →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
