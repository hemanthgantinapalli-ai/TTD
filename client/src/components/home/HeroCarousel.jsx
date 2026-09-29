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

/* ── helpers ─────────────────────────────────────────────── */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const AUTOPLAY_INTERVAL = 3500; // 3.5s smooth continuous slide cycle

/* ── Reusable arrow SVGs ─────────────────────────────────── */
const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ════════════════════════════════════════════════════════════
   HeroCarousel — main component
   ════════════════════════════════════════════════════════════ */
const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const heroRef = useRef(null);
  const total = HERO_SLIDES.length;

  /* ── Navigation helpers ──────────────────────────────── */
  const goTo = useCallback((idx) => {
    setCurrent((idx + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  /* ── Continuous Autoplay ─────────────────────────────── */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [total]);

  /* ── Keyboard navigation ─────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  /* ── Touch gestures for mobile swipe ─────────────────── */
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      next(); // Swiped left -> next
    } else if (distance < -minSwipeDistance) {
      prev(); // Swiped right -> prev
    }
  };

  const slide = HERO_SLIDES[current];

  return (
    <section
      ref={heroRef}
      className={styles.carousel}
      aria-label="TTD Yatra Hero Carousel"
      aria-roledescription="carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Top Dynamic Progress Bar ────────────────────── */}
      <div className={styles.progressBarWrapper} aria-hidden="true">
        <div
          key={current}
          className={styles.progressBarFill}
          style={{ animationDuration: `${AUTOPLAY_INTERVAL}ms` }}
        />
      </div>


      {/* ── Background slides ───────────────────────────── */}
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
              style={{ objectPosition: s.objectPosition }}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
            <div className={styles.slideOverlay} />
            <div className={styles.ambientGlow} />
          </div>
        ))}

        {/* ── Divine Floating Golden Particles ─────────────── */}
        <div className={styles.particlesContainer} aria-hidden="true">
          <span className={`${styles.particle} ${styles.p1}`} />
          <span className={`${styles.particle} ${styles.p2}`} />
          <span className={`${styles.particle} ${styles.p3}`} />
          <span className={`${styles.particle} ${styles.p4}`} />
          <span className={`${styles.particle} ${styles.p5}`} />
          <span className={`${styles.particle} ${styles.p6}`} />
          <span className={`${styles.particle} ${styles.p7}`} />
          <span className={`${styles.particle} ${styles.p8}`} />
          <span className={`${styles.particle} ${styles.p9}`} />
          <span className={`${styles.particle} ${styles.p10}`} />
          <span className={`${styles.particle} ${styles.p11}`} />
          <span className={`${styles.particle} ${styles.p12}`} />
        </div>

        {/* ── Atmospheric Light Orbs ────────────────────────── */}
        <div className={`${styles.lightOrb} ${styles.orbA}`} aria-hidden="true" />
        <div className={`${styles.lightOrb} ${styles.orbB}`} aria-hidden="true" />

        {/* ── Sacred Spinning Mandala Rings ─────────────────── */}
        <div className={`${styles.mandalaRing} ${styles.mandalaOuter}`} aria-hidden="true" />
        <div className={`${styles.mandalaRing} ${styles.mandalaInner}`} aria-hidden="true" />
      </div>

      {/* ── Main hero layout ─────────────────────────────── */}
      <div className={styles.heroLayout}>
        <div className={styles.heroInner}>

          {/* LEFT — hero text content */}
          <div className={styles.heroContent} key={current}>

            {/* Sacred Animated Aura / Chakra behind heading */}
            <div className={styles.divineChakra} aria-hidden="true" />

            {/* Live ticker banner */}
            <div className={styles.liveTicker} role="status" aria-live="polite">
              <span className={styles.pulseDot} />
              <span className={styles.tickerBadge}>LIVE DARSHAN DESK</span>
              <span className={styles.tickerText}>
                {slide.liveUpdate || 'Srivari Darshan running smoothly • Free SSD Token offline counters active'}
              </span>
            </div>

            {/* Floating Yatra Assurance Pill */}
            <div className={styles.floatingPerkCard}>
              <span className={styles.floatingPerkIcon}>🛕</span>
              <div className={styles.floatingPerkText}>
                <strong>Srivari Darshan Guidance Available</strong>
                <span>Instant confirmation &amp; Senior Citizen care</span>
              </div>
              <span className={styles.floatingLiveBadge}>ACTIVE</span>
            </div>

            {/* Slide Ribbon Badge */}
            {slide.badge && (
              <div className={styles.badgeWrapper}>
                <span className={styles.badgeRibbon}>
                  {slide.badge}
                </span>
                {slide.stat && (
                  <span className={styles.badgeStat}>
                    <span className={styles.sparkle}>✦</span> {slide.stat}
                  </span>
                )}
              </div>
            )}

            {/* Eyebrow */}
            <span className={styles.eyebrow} aria-label={slide.eyebrow}>
              {slide.eyebrow}
            </span>

            {/* Main heading */}
            <h1 className={styles.heroTitle}>
              {slide.title.split('\n').map((line, i) => (
                <span key={i}>
                  {i === slide.title.split('\n').length - 1
                    ? <span className={styles.accentGold}>{line}</span>
                    : <>{line}<br /></>
                  }
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className={styles.heroDesc}>{slide.description}</p>

            {/* Slide feature highlights */}
            {slide.highlights && (
              <div className={styles.highlightsContainer}>
                {slide.highlights.map((h, i) => (
                  <span key={i} className={styles.highlightChip}>
                    <span className={styles.chipCheck}>✓</span> {h}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className={styles.heroBtns}>
              <Link to={ROUTES.PACKAGES} className={styles.btnGold} aria-label="Explore Yatra Packages">
                <span>Explore Yatra Packages</span>
                <span className={styles.btnArrow}>→</span>
              </Link>
              <Link to={ROUTES.DARSHAN_GUIDE} className={styles.btnOutline} aria-label="Darshan Guidelines">
                <span>Darshan Guidelines &amp; Tips</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className={styles.trustBadges} aria-label="Trust indicators">
              <div className={styles.trustItem}>
                <div className={styles.trustIconCircle}>
                  <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <strong>4.9 / 5 Rating</strong>
                  <span className={styles.trustSub}>5,000+ Pilgrim Reviews</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconCircle}>
                  <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                </div>
                <div>
                  <strong>Ghat Road Certified</strong>
                  <span className={styles.trustSub}>Professional Drivers</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustIconCircle}>
                  <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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


      {/* ── Interactive Category Pills (Bottom Navigation) ── */}
      <div className={styles.categoryPillsNav} role="tablist" aria-label="Sacred Yatra experiences">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`${styles.pillBtn} ${i === current ? styles.pillBtnActive : ''}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === current}
          >
            <span className={styles.pillIcon}>{s.icon || '🛕'}</span>
            <span className={styles.pillLabel}>{s.shortTitle || `Slide ${i + 1}`}</span>
            {i === current && <span className={styles.pillActiveDot} />}
          </button>
        ))}
      </div>

      {/* ── Controls row (Prev/Next buttons) ─────────────── */}
      <div className={styles.controls} role="group" aria-label="Carousel controls">
        <button
          className={styles.navBtn}
          onClick={prev}
          aria-label="Previous slide"
          type="button"
        >
          <ChevronLeft />
        </button>

        {/* Dot indicators */}
        <div className={styles.indicators} role="tablist" aria-label="Slide indicators">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${s.alt}`}
              aria-selected={i === current}
              role="tab"
              type="button"
            />
          ))}
        </div>

        <button
          className={styles.navBtn}
          onClick={next}
          aria-label="Next slide"
          type="button"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;
