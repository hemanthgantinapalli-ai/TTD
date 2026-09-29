import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../../../redux/slices/packageSlice';
import { ROUTES } from '../../../constants/routes';
import homeStyles from '../Home/Home.module.css';

const PackagesList = () => {
  const dispatch = useDispatch();
  const { packages, isLoading } = useSelector((state) => state.package);
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'all';
  const [selectedDuration, setSelectedDuration] = useState(catParam);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const filteredPackages = (packages || []).filter((pkg) => {
    if (selectedDuration === 'all') return true;
    if (selectedDuration === '1-day') return pkg.duration.includes('1 Day');
    if (selectedDuration === '2-day') return pkg.duration.includes('2 Days');
    if (selectedDuration === 'elder') return pkg.category.toLowerCase().includes('special');
    return true;
  });

  if (isLoading && packages.length === 0) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="skeleton" style={{ width: '200px', height: '24px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="packages-page">
      <div className="section" style={{ background: 'linear-gradient(170deg, #FAF0F2 0%, #FBF7EF 100%)', padding: '48px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <span className="eyebrow">Sacred Pilgrimage Circuits</span>
          <h1 className="text-maroon font-display" style={{ marginTop: '8px' }}>
            Tirupati & Tirumala Yatra Packages
          </h1>
          <p className="text-muted" style={{ maxWidth: '650px', margin: '8px auto 0' }}>
            Carefully curated complete pilgrimage itineraries with AC transport, stay, darshan guidance, and local temple visits.
          </p>
        </div>
      </div>

      <div className="container section">
        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[
            { id: 'all', label: 'All Packages' },
            { id: '1-day', label: '1-Day Express Yatras' },
            { id: '2-day', label: '2-Day Complete Circuits' },
            { id: 'elder', label: 'Elder & Senior Citizen Care' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              className={`btn btn-sm ${selectedDuration === btn.id ? 'btn-maroon' : 'btn-outline'}`}
              onClick={() => setSelectedDuration(btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className={homeStyles.cardsGrid}>
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className={homeStyles.packageCard}>
              <div className={homeStyles.cardMedia}>
                <img src={pkg.thumbnail} alt={pkg.title} className={homeStyles.cardImg} loading="lazy" />
                <div className={homeStyles.badgeOverlay}>
                  <span className="badge badge-gold">{pkg.badge}</span>
                </div>
                <div className={homeStyles.ratingOverlay}>
                  <span>★ {pkg.rating}</span>
                  <span style={{ opacity: 0.8, fontSize: '11px' }}>({pkg.reviewCount})</span>
                </div>
              </div>

              <div className={homeStyles.cardBody}>
                <span style={{ fontSize: '12px', color: 'var(--color-gold-700)', fontWeight: 600 }}>
                  {pkg.duration} • {pkg.category}
                </span>
                <h2 className={homeStyles.cardTitle}>{pkg.title}</h2>
                <p className={homeStyles.cardDesc}>{pkg.tagline}</p>

                <div className={homeStyles.highlightsList}>
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className={homeStyles.highlightItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className={homeStyles.cardFooter}>
                  <div className={homeStyles.priceBlock}>
                    <span className={homeStyles.priceLabel}>Starting from</span>
                    <div className="flex items-center gap-2">
                      <span className="price">₹{pkg.startingPrice.toLocaleString('en-IN')}</span>
                      <span className="price-original">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>/ person</span>
                    </div>
                  </div>
                  <Link to={ROUTES.PACKAGE_DETAIL(pkg.slug)} className="btn btn-gold btn-sm">
                    View Itinerary →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackagesList;
