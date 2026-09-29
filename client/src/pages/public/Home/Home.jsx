import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../../../constants/routes';
import { MOCK_REVIEWS, MOCK_FAQS } from '../../../data/mockData';
import { APP_CONFIG } from '../../../config/appConfig';
import HeroCarousel from '../../../components/home/HeroCarousel';
import DevotionalMusicPlayer from '../../../components/audio/DevotionalMusicPlayer';
import styles from './Home.module.css';
import { fetchPackages } from '../../../redux/slices/packageSlice';
import { fetchHotels } from '../../../redux/slices/hotelSlice';
import { fetchCars } from '../../../redux/slices/carSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { packages } = useSelector((state) => state.package);
  const { hotels } = useSelector((state) => state.hotel);
  const { cars } = useSelector((state) => state.car);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    if (!packages.length) dispatch(fetchPackages());
    if (!hotels.length) dispatch(fetchHotels());
    if (!cars.length) dispatch(fetchCars());
  }, [dispatch]);

  // Fall back to mockData while loading
  const displayPackages = packages.length ? packages : [];
  const displayHotels = hotels.length ? hotels : [];
  const displayCars = cars.length ? cars : [];

  return (
    <div className="home-page">
      {/* ── 1. Hero — Full-width Carousel ─────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'clamp(600px, 85vh, 960px)',
          overflow: 'hidden',
        }}
        aria-label="TTD Yatra Hero"
      >
        <HeroCarousel />
      </section>

      {/* ── Continuous Animated Live Marquee Ribbon ──────── */}
      <div className={styles.marqueeStrip} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          <span className={styles.marqueeItem}>🛕 Srivari Darshan Running Smoothly</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>⚡ Free SSD Token Offline Centers Active at Alipiri &amp; Srinivasam</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>🚗 100% Hill-Certified AC Innova &amp; Sedan Fleet</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>🏨 Handpicked Pure Veg Stays With 24-Hr Hot Water</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>👵 Priority Assistance for Senior Citizens &amp; Infants</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>🌟 15,000+ Devotee Families Guided with Love</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>📞 24/7 Instant Tirupati Ground Helpdesk</span>
          <span className={styles.marqueeDot}>✦</span>
          {/* Repeated for seamless infinite loop */}
          <span className={styles.marqueeItem}>🛕 Srivari Darshan Running Smoothly</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>⚡ Free SSD Token Offline Centers Active at Alipiri &amp; Srinivasam</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>🚗 100% Hill-Certified AC Innova &amp; Sedan Fleet</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>🏨 Handpicked Pure Veg Stays With 24-Hr Hot Water</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>👵 Priority Assistance for Senior Citizens &amp; Infants</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>🌟 15,000+ Devotee Families Guided with Love</span>
          <span className={styles.marqueeDot}>✦</span>
          <span className={styles.marqueeItem}>📞 24/7 Instant Tirupati Ground Helpdesk</span>
          <span className={styles.marqueeDot}>✦</span>
        </div>
      </div>


      <section className="section bg-ivory">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="eyebrow">Carefully Curated Itineraries</span>
            <h2 className={styles.sectionTitle}>Featured Tirupati Pilgrimage Packages</h2>
            <p className={styles.sectionSubtitle}>
              From same-day return darshan yatras to comprehensive multi-temple spiritual circuits with stay and cab.
            </p>
          </div>

          <div className={styles.cardsGrid}>
            {displayPackages.map((pkg) => (
              <div key={pkg.id} className={styles.packageCard}>
                <div className={styles.cardMedia}>
                  <img src={pkg.thumbnail} alt={pkg.title} className={styles.cardImg} loading="lazy" />
                  <div className={styles.badgeOverlay}>
                    <span className="badge badge-gold">{pkg.badge}</span>
                  </div>
                  <div className={styles.ratingOverlay}>
                    <span>★ {pkg.rating}</span>
                    <span style={{ opacity: 0.8, fontSize: '11px' }}>({pkg.reviewCount})</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <span style={{ fontSize: '12px', color: 'var(--color-gold-700)', fontWeight: 600 }}>
                    {pkg.duration} • {pkg.category}
                  </span>
                  <h3 className={styles.cardTitle}>{pkg.title}</h3>
                  <p className={styles.cardDesc}>{pkg.tagline}</p>

                  <div className={styles.highlightsList}>
                    {pkg.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className={styles.highlightItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceBlock}>
                      <span className={styles.priceLabel}>Starting from</span>
                      <div className="flex items-center gap-2">
                        <span className="price">₹{pkg.startingPrice.toLocaleString('en-IN')}</span>
                        <span className="price-original">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <Link to={ROUTES.PACKAGE_DETAIL(pkg.slug)} className="btn btn-gold btn-sm">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to={ROUTES.PACKAGES} className="btn btn-outline">
              Explore All Yatra Packages ({displayPackages.length})
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. Top Hotels ────────────────────────────────── */}
      <section className="section bg-cream">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="eyebrow">Handpicked Pilgrim Stays</span>
            <h2 className={styles.sectionTitle}>Comfortable & Pure Veg Stays in Tirupati</h2>
            <p className={styles.sectionSubtitle}>
              Clean hygienic rooms, 24-hr hot water, proximity to temple transit hubs, and authentic South Indian dining.
            </p>
          </div>

          <div className={styles.cardsGrid}>
            {displayHotels.slice(0, 3).map((hotel) => (
              <div key={hotel.id} className={styles.packageCard}>
                <div className={styles.cardMedia}>
                  <img src={hotel.thumbnail} alt={hotel.name} className={styles.cardImg} loading="lazy" />
                  <div className={styles.badgeOverlay}>
                    <span className="badge badge-maroon">{hotel.category}</span>
                  </div>
                  <div className={styles.ratingOverlay}>
                    <span>★ {hotel.reviewRating}</span>
                    <span style={{ opacity: 0.8, fontSize: '11px' }}>({hotel.reviewCount})</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <span style={{ fontSize: '12px', color: 'var(--color-maroon-700)', fontWeight: 600 }}>
                    📍 {hotel.location}
                  </span>
                  <h3 className={styles.cardTitle}>{hotel.name}</h3>
                  <p className={styles.cardDesc}>{hotel.tagline}</p>

                  <div className={styles.highlightsList}>
                    {hotel.amenities.slice(0, 3).map((a, i) => (
                      <div key={i} className={styles.highlightItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceBlock}>
                      <span className={styles.priceLabel}>Per Night</span>
                      <div className="flex items-center gap-2">
                        <span className="price">₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
                        <span className="price-original">₹{hotel.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <Link to={ROUTES.HOTEL_DETAIL(hotel.slug)} className="btn btn-gold btn-sm">
                      Select Room →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to={ROUTES.HOTELS} className="btn btn-outline">
              View All Hotels in Tirupati
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Cab Fleet ─────────────────────────────────── */}
      <section className="section bg-ivory">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="eyebrow">Hill-Certified Travel Fleet</span>
            <h2 className={styles.sectionTitle}>Reliable Tirumala Ghat Road Cabs</h2>
            <p className={styles.sectionSubtitle}>
              Clean AC cars with experienced local drivers who know every turn of the 7 hills and temple drop points.
            </p>
          </div>

          <div className={styles.cardsGrid}>
            {displayCars.slice(0, 3).map((car) => (
              <div key={car.id} className={styles.packageCard}>
                <div className={styles.cardMedia}>
                  <img src={car.thumbnail} alt={car.name} className={styles.cardImg} loading="lazy" />
                  <div className={styles.badgeOverlay}>
                    <span className="badge badge-gold">{car.capacity}</span>
                  </div>
                  <div className={styles.ratingOverlay}>
                    <span>★ {car.rating}</span>
                    <span style={{ opacity: 0.8, fontSize: '11px' }}>({car.reviewCount})</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <span style={{ fontSize: '12px', color: 'var(--color-gold-700)', fontWeight: 600 }}>
                    {car.category} • {car.fuelType}
                  </span>
                  <h3 className={styles.cardTitle}>{car.name}</h3>
                  <p className={styles.cardDesc}>{car.description}</p>

                  <div className={styles.highlightsList}>
                    {car.features.slice(0, 3).map((f, i) => (
                      <div key={i} className={styles.highlightItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-700)" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceBlock}>
                      <span className={styles.priceLabel}>Daily Package</span>
                      <div className="flex items-center gap-2">
                        <span className="price">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/ day</span>
                      </div>
                    </div>
                    <Link to={ROUTES.CAR_DETAIL(car.slug)} className="btn btn-gold btn-sm">
                      Book Cab →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to={ROUTES.CARS} className="btn btn-outline">
              Explore Complete Cab Fleet
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Darshan Guidelines Banner ──────────────────── */}
      <section className="container">
        <div className={styles.guidelinesBanner}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '12px' }}>TTD Vedic Protocol</span>
            <h2 style={{ fontSize: '24px', color: 'var(--color-white)', marginTop: '8px' }}>
              Important Guidelines for Tirumala Devotees
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', marginTop: '8px' }}>
              Traditional dress code is strictly mandated for entering the sanctum queue complex.
            </p>

            <div className={styles.guidelinePoints}>
              <div className={styles.guidelineItem}>
                <span>👔</span>
                <div>
                  <strong>Men:</strong> White Dhoti/Kurta or Pyjama. Jeans/T-shirts strictly prohibited.
                </div>
              </div>
              <div className={styles.guidelineItem}>
                <span>🥻</span>
                <div>
                  <strong>Women:</strong> Saree, Half-Saree or Churidar with Dupatta properly pinned.
                </div>
              </div>
              <div className={styles.guidelineItem}>
                <span>🪪</span>
                <div>
                  <strong>Original ID:</strong> Original Aadhaar / Passport mandatory for entry verification.
                </div>
              </div>
              <div className={styles.guidelineItem}>
                <span>🚫</span>
                <div>
                  <strong>Electronics:</strong> Mobile phones & smartwatches are banned inside temple queue.
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to={ROUTES.DARSHAN_GUIDE} className="btn btn-gold btn-lg">
              Read Full Darshan Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Why Choose Us ─────────────────────────────── */}
      <section className={`section ${styles.whyUsSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="eyebrow">The TTD Yatra Promise</span>
            <h2 className={styles.sectionTitle}>Why Devotees Trust Us With Their Pilgrimage</h2>
            <p className={styles.sectionSubtitle}>
              We are not just a travel service — we are your local pilgrim companions committed to a peaceful, unhurried darshan.
            </p>
          </div>

          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyIconWrap}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-maroon-900)' }}>Local Tirupati Expertise</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Our team is based in Tirupati. We track live queue movement, token counters, and ghat timings daily to guide you best.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIconWrap}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-maroon-900)' }}>Elder & Child Friendly</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Paced itineraries with minimal walking, elevator-access hotel rooms, wheelchair assistance, and considerate driving.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIconWrap}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M7 15h0M2 9.5h20"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-maroon-900)' }}>Transparent & Honest</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Clear pricing with no surprise taxes or surge pricing. 100% free cancellation up to 24 hours prior to travel.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIconWrap}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-maroon-900)' }}>24/7 Helpline on WhatsApp</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Stay connected throughout your journey. Call or WhatsApp our coordinator whenever you need assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Devotee Testimonials ──────────────────────── */}
      <section className="section bg-ivory">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="eyebrow">Pilgrim Stories</span>
            <h2 className={styles.sectionTitle}>What Devotees Say About TTD Yatra</h2>
            <p className={styles.sectionSubtitle}>
              Real experiences from families across India who traveled to Lord Venkateswara with our assistance.
            </p>
          </div>

          <div className={styles.testiGrid}>
            {MOCK_REVIEWS.map((rev) => (
              <div key={rev.id} className={styles.testiCard}>
                <div>
                  <div style={{ color: 'var(--color-gold-600)', marginBottom: '10px' }}>
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className={styles.testiComment}>"{rev.comment}"</p>
                </div>
                <div className={styles.testiAuthor}>
                  <div>
                    <div className={styles.authorName}>{rev.author}</div>
                    <div className={styles.authorCity}>{rev.city} • {rev.service}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)' }}>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Frequently Asked Questions ────────────────── */}
      <section className="section bg-cream">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="eyebrow">Got Questions?</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Pilgrimage Questions</h2>
            <p className={styles.sectionSubtitle}>
              Clear answers to help you prepare for a hassle-free yatra.
            </p>
          </div>

          <div className={styles.faqContainer}>
            {MOCK_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={styles.faqItem}>
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', fontSize: '18px' }}>
                      ▼
                    </span>
                  </button>
                  {isOpen && <div className={styles.faqAnswer}>{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ── Devotional Music Player (fixed, bottom-right) ─── */}
      <DevotionalMusicPlayer />
    </div>
  );
};

export default Home;
