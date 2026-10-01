import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackageBySlug } from '../../../redux/slices/packageSlice';
import { ROUTES } from '../../../constants/routes';
import { startBooking } from '../../../redux/slices/bookingSlice';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import styles from './Packages.module.css';

const PackageDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedPackage: pkg, isLoading } = useSelector((state) => state.package);

  useEffect(() => {
    if (slug) dispatch(fetchPackageBySlug(slug));
  }, [dispatch, slug]);

  const handleBookPackage = () => {
    if (!pkg) return;
    dispatch(startBooking({
      type: 'package',
      itemId: pkg.id,
      itemSlug: pkg.slug,
      itemData: pkg,
    }));
    navigate(ROUTES.TRAVELLER_DETAILS);
  };

  if (isLoading || !pkg) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="skeleton" style={{ width: '300px', height: '28px', margin: '0 auto 12px' }} />
        <div className="skeleton" style={{ width: '200px', height: '18px', margin: '0 auto' }} />
      </div>
    );
  }
  return (
    <div className="package-detail-page">
      <PageHeader
        eyebrow={pkg.badge ? pkg.badge.toUpperCase() : (pkg.category ? pkg.category.toUpperCase() : 'PILGRIMAGE PACKAGE')}
        title={pkg.title}
        subtitle={pkg.tagline}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Packages', path: ROUTES.PACKAGES },
          { label: pkg.title },
        ]}
      />

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {/* Left Column: Itinerary, Inclusions/Exclusions */}
          <div>
            <div className="card" style={{ overflow: 'hidden', marginBottom: '32px' }}>
              <img src={pkg.thumbnail} alt={pkg.title} style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-maroon-900)', marginBottom: '12px' }}>
                  Tour Highlights
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--color-neutral-800)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Day-by-Day Timeline */}
            <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--color-maroon-900)', marginBottom: '24px' }}>
                📅 Detailed Pilgrimage Itinerary
              </h3>

              <div className={styles.timeline}>
                {pkg.itinerary.map((item, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineTime}>{item.time}</div>
                    <h4 className={styles.timelineTitle}>{item.title}</h4>
                    <p className={styles.timelineDesc}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className={styles.inclusionsGrid}>
              <div className={styles.inclusionBox}>
                <h4 style={{ color: 'var(--color-success)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✓</span> Package Inclusions
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-neutral-800)' }}>
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i}>• {inc}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.exclusionBox}>
                <h4 style={{ color: 'var(--color-error)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✕</span> Exclusions
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-neutral-800)' }}>
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i}>• {exc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Widget */}
          <div>
            <div className="card" style={{ padding: '32px', position: 'sticky', top: '90px' }}>
              <span className="eyebrow">Yatra Summary</span>
              <div style={{ margin: '12px 0 20px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)', textTransform: 'uppercase' }}>
                  All-Inclusive Price
                </span>
                <div className="flex items-center gap-2">
                  <span className="price" style={{ fontSize: '32px' }}>₹{pkg.startingPrice.toLocaleString('en-IN')}</span>
                  <span className="price-original">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/ person</span>
                </div>
              </div>

              <div style={{ background: 'var(--color-sandal-100)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--color-neutral-800)' }}>
                <div>⏱️ <strong>Duration:</strong> {pkg.duration}</div>
                <div style={{ marginTop: '6px' }}>🚗 <strong>Transport:</strong> Dedicated AC Cab included</div>
                <div style={{ marginTop: '6px' }}>🛡️ <strong>Assistance:</strong> 24/7 Pilgrim Guide support</div>
                <div style={{ marginTop: '6px' }}>🏷️ <strong>Free Cancellation:</strong> Full refund up to 24h before</div>
              </div>

              <button
                type="button"
                onClick={handleBookPackage}
                className="btn btn-gold btn-lg"
                style={{ width: '100%' }}
              >
                Book This Package →
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Have questions before booking?{' '}
                <a
                  href="https://wa.me/919148391081"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#25D366', fontWeight: 600 }}
                >
                  Chat with Yatra Expert
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
