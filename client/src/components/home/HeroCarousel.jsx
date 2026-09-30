/**
 * HeroCarousel.jsx — TTD Yatra Premium Hero
 * Cinematic Tirumala Temple Hero with:
 *   - Tirumala temple clearly visible on the right side
 *   - 90deg Maroon gradient overlay: dark left, clear temple right
 *   - Elegant serif typography & gold accent #D4A72C
 *   - Explore Yatra Packages & Explore Hotels CTAs
 *   - Clean bottom (no scroll animations, no floating search widget)
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Link } from 'react-router-dom';
import { HERO_SLIDES } from '../../data/heroSlides';
import { ROUTES } from '../../constants/routes';
import styles from './HeroCarousel.module.css';

/* ── Helpers ─────────────────────────────────────────────── */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const AUTOPLAY_INTERVAL = 6000;

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const heroRef = useRef(null);
  const total = HERO_SLIDES.length;

  /* ── Navigation ─────────────────────────────────────── */
  const goTo = useCallback((idx) => setCurrent((idx + total) % total), [total]);
  const next = useCallback(() => setCurrent((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + total) % total), [total]);

  /* ── Autoplay ────────────────────────────────────────── */
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  /* ── Keyboard ───────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  /* ── Touch swipe ─────────────────────────────────────── */
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const d = touchStart - touchEnd;
    if (d > 50) next();
    if (d < -50) prev();
  };

  const slide = HERO_SLIDES[current];

  return (
    <section
      ref={heroRef}
      className={styles.carousel}
      aria-label="TTD Yatra Hero"
      aria-roledescription="carousel"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Slide images ──────────────────────────────── */}
      <div className={styles.slidesContainer} aria-hidden="true">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`${styles.slide} ${i === current ? styles.slideActive : styles.slideInactive}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${total}: ${s.alt}`}
          >
            <img
              src={s.image}
              alt={s.alt}
              className={styles.slideImage}
              style={{ objectPosition: '65% center' }}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
            {/* Maroon overlay: darker left, clear temple right */}
            <div className={styles.slideOverlay} />
          </div>
        ))}

        {/* Subtle golden ambient particles */}
        <div className={styles.particlesContainer} aria-hidden="true">
          <span className={`${styles.particle} ${styles.p1}`} />
          <span className={`${styles.particle} ${styles.p2}`} />
          <span className={`${styles.particle} ${styles.p3}`} />
          <span className={`${styles.particle} ${styles.p4}`} />
          <span className={`${styles.particle} ${styles.p5}`} />
          <span className={`${styles.particle} ${styles.p6}`} />
        </div>
      </div>

      {/* ── Main hero content ─────────────────────────── */}
      <div className={styles.heroLayout}>
        <div className={styles.heroInner}>

          {/* LEFT COLUMN — hero text */}
          <div className={styles.heroContent} key={current}>

            {/* Eyebrow */}
            <div className={styles.eyebrowRow} aria-hidden="true">
              <span className={styles.eyebrowLine} />
              <span className={styles.eyebrow}>
                {slide.eyebrow || 'DEVOTIONAL JOURNEY ARRANGED WITH CARE'}
              </span>
              <span className={styles.eyebrowLine} />
            </div>

            {/* Main heading in Title Case */}
            <h1 className={styles.heroTitle}>
              Your Sacred<br />
              Pilgrimage to<br />
              <span className={styles.accentGold}>Tirumala Tirupati</span>
            </h1>

            {/* Description */}
            <p className={styles.heroDesc}>
              Hand-picked stays, trusted cabs and thoughtful travel planning
              for a peaceful Tirumala Tirupati pilgrimage.
            </p>

            {/* CTA Buttons */}
            <div className={styles.heroBtns}>
              <Link
                to={ROUTES.PACKAGES}
                className={styles.btnGold}
                aria-label="Explore Yatra Packages"
              >
                <span>Explore Yatra Packages</span>
                <span className={styles.btnArrow} aria-hidden="true">→</span>
              </Link>
              <Link
                to={ROUTES.HOTELS}
                className={styles.btnOutline}
                aria-label="Explore Hotels"
              >
                <span>Explore Hotels</span>
                <span className={styles.btnArrow} aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className={styles.trustBadges} aria-label="Trust indicators">
              <div className={styles.trustItem}>
                <div className={styles.trustIconCircle} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <strong>4.9 / 5 Rating</strong>
                  <span className={styles.trustSub}>5,000+ Pilgrim Reviews</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconCircle} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                </div>
                <div>
                  <strong>Ghat Road Certified</strong>
                  <span className={styles.trustSub}>Expert Tirumala Drivers</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconCircle} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <strong>100% Pure Veg Stays</strong>
                  <span className={styles.trustSub}>Hand-picked Comfort</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
