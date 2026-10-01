import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels } from '../../../redux/slices/hotelSlice';
import { ROUTES } from '../../../constants/routes';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import styles from './Hotels.module.css';

const HotelsList = () => {
  const dispatch = useDispatch();
  const { hotels, isLoading, error } = useSelector((state) => state.hotel);
  const [searchParams] = useSearchParams();

  // Filter states (client-side after initial fetch)
  const [selectedStars, setSelectedStars] = useState([]);
  const [vegOnly, setVegOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const toggleStar = (star) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const filteredHotels = useMemo(() => {
    return (hotels || []).filter((hotel) => {
      if (vegOnly && !hotel.vegOnly) return false;
      if (selectedStars.length > 0 && !selectedStars.includes(hotel.starRating)) return false;
      if (hotel.pricePerNight > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-high') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'rating') return b.reviewRating - a.reviewRating;
      return 0;
    });
  }, [hotels, selectedStars, vegOnly, maxPrice, sortBy]);

  if (isLoading && hotels.length === 0) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="skeleton" style={{ width: '200px', height: '24px', margin: '0 auto 12px' }} />
        <div className="skeleton" style={{ width: '140px', height: '18px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="hotels-page">
      <PageHeader
        eyebrow="COMFORTABLE STAYS"
        title="TIRUPATI HOTELS & STAYS"
        subtitle="Comfortable accommodation options for your pilgrimage journey."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Hotels' },
        ]}
      />

      <div className="container section">
        <div className={styles.layoutGrid}>
          {/* Filters Sidebar */}
          <aside className={styles.filterSidebar}>
            <div className={styles.filterTitle}>
              <span>Filters</span>
              {(selectedStars.length > 0 || vegOnly || maxPrice < 10000) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStars([]);
                    setVegOnly(false);
                    setMaxPrice(10000);
                  }}
                  style={{ fontSize: '12px', color: 'var(--color-maroon-700)', textDecoration: 'underline' }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Veg Only Toggle */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Food Preference</div>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                />
                <span>🌿 100% Pure Veg Stays Only</span>
              </label>
            </div>

            {/* Star Rating */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Star Rating</div>
              {[5, 4, 3].map((star) => (
                <label key={star} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedStars.includes(star)}
                    onChange={() => toggleStar(star)}
                  />
                  <span>{star} Star Hotels ({star === 5 ? 'Luxury' : star === 4 ? 'Premium' : 'Comfort'})</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>
                Max Budget: ₹{maxPrice.toLocaleString('en-IN')} / night
              </div>
              <input
                type="range"
                min="1500"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-maroon-900)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>₹1,500</span>
                <span>₹10,000+</span>
              </div>
            </div>
          </aside>

          {/* Results Main Column */}
          <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Showing <strong>{filteredHotels.length}</strong> stays in Tirupati
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sort by:</span>
                <select
                  className="input"
                  style={{ minHeight: '36px', padding: '4px 12px', fontSize: '13px', width: 'auto' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {filteredHotels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-paper)', borderRadius: '12px' }}>
                <h3>No hotels match your selected filters</h3>
                <p className="text-muted" style={{ marginTop: '8px' }}>Try relaxing your price range or star rating filters.</p>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '16px' }}
                  onClick={() => {
                    setSelectedStars([]);
                    setVegOnly(false);
                    setMaxPrice(10000);
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={styles.hotelListGrid}>
                {filteredHotels.map((hotel) => (
                  <div key={hotel.id} className={styles.hotelCardHorizontal}>
                    <div className={styles.cardImgWrap}>
                      <img src={hotel.thumbnail} alt={hotel.name} className={styles.cardImg} loading="lazy" />
                      {hotel.vegOnly && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                          <span className="badge badge-success">🌿 Pure Veg</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.cardContent}>
                      <div>
                        <div className={styles.hotelMeta}>
                          <span className="badge badge-maroon">{hotel.category}</span>
                          <span style={{ color: 'var(--color-gold-700)', fontWeight: 600 }}>
                            ★ {hotel.reviewRating} ({hotel.reviewCount} reviews)
                          </span>
                        </div>

                        <h2 className={styles.hotelTitle}>
                          <Link to={ROUTES.HOTEL_DETAIL(hotel.slug)} className="link-underline">
                            {hotel.name}
                          </Link>
                        </h2>

                        <div className={styles.hotelAddress}>
                          <span>📍 {hotel.address}</span>
                        </div>

                        <div className={styles.proximityBadges}>
                          <span className={styles.proxBadge}>🚂 Railway Stn: {hotel.proximity.railwayStation}</span>
                          <span className={styles.proxBadge}>⛩️ Alipiri Gate: {hotel.proximity.alipiriTollGate}</span>
                          <span className={styles.proxBadge}>✈️ Airport: {hotel.proximity.airport}</span>
                        </div>

                        <p style={{ fontSize: '13px', color: 'var(--color-neutral-700)', lineHeight: 1.5 }}>
                          {hotel.description.slice(0, 140)}...
                        </p>
                      </div>

                      <div className={styles.hotelCardFooter}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textTransform: 'uppercase' }}>
                            Starting from
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="price">₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
                            <span className="price-original">₹{hotel.originalPrice.toLocaleString('en-IN')}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/ night</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to={ROUTES.HOTEL_DETAIL(hotel.slug)} className="btn btn-outline btn-sm">
                            View Details
                          </Link>
                          <Link to={ROUTES.HOTEL_DETAIL(hotel.slug)} className="btn btn-gold btn-sm">
                            Select Room →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HotelsList;
