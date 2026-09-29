import React from 'react';
import styles from './Logo.module.css';

/**
 * TTDYATRA Gopuram Logo
 * The seven-tier gopuram SVG with kalasham, namam, and TTDYATRA wordmark.
 * Usage: <Logo size="md" variant="default|white|gold" showWordmark />
 */
const Logo = ({
  size = 'md',
  variant = 'default',
  showWordmark = true,
  className = '',
  ...props
}) => {
  const sizeMap = { xs: 24, sm: 28, md: 36, lg: 48, xl: 64 };
  const iconSize = sizeMap[size] || sizeMap.md;

  const colorMap = {
    default: 'var(--color-gold-700)',
    white: 'var(--color-white)',
    gold: 'var(--color-gold-600)',
    maroon: 'var(--color-maroon-900)',
  };

  const iconColor = colorMap[variant] || colorMap.default;

  const textColorMap = {
    default: 'var(--color-ink)',
    white: 'var(--color-white)',
    gold: 'var(--color-gold-600)',
    maroon: 'var(--color-maroon-900)',
  };

  const wordmarkColor = textColorMap[variant] || textColorMap.default;

  return (
    <span className={`${styles.logo} ${styles[`logo--${size}`]} ${className}`} {...props}>
      {/* 
        Updated Gopuram SVG Icon matching the provided TTDYATRA logo
        Golden multi-tiered tower with the 'U' (Namam) in the entrance arch.
      */}
      <svg
        viewBox="0 0 40 48"
        width={iconSize}
        height={iconSize * 1.2}
        fill="currentColor"
        style={{ flexShrink: 0, color: iconColor }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2DEA2" />
            <stop offset="50%" stopColor="#E3C05C" />
            <stop offset="100%" stopColor="#A88318" />
          </linearGradient>
        </defs>

        <g fill="url(#goldGradient)">
          {/* Kalasham (top finial) */}
          <path d="M20 2 l2 4 h-4 z" />
          <circle cx="20" cy="7" r="1.5" />
          <path d="M19 8 h2 v2 h-2 z" />

          {/* Top Tier */}
          <path d="M16 10 h8 v3 h-8 z" />
          <path d="M15 13 h10 v2 h-10 z" />

          {/* Tier 2 */}
          <path d="M14 15 h12 v4 h-12 z" />
          <path d="M13 19 h14 v2 h-14 z" />
          
          {/* Tier 3 */}
          <path d="M12 21 h16 v5 h-16 z" />
          <path d="M11 26 h18 v2 h-18 z" />
          
          {/* Tier 4 */}
          <path d="M10 28 h20 v5 h-20 z" />
          <path d="M9 33 h22 v2 h-22 z" />
          
          {/* Base Tier (Garbhagriha) */}
          <path d="M8 35 h24 v9 h-24 z" />
          <path d="M7 44 h26 v3 h-26 z" />

          {/* Side pillars detailing (left) */}
          <path d="M7 35 h2 v9 h-2 z" />
          <path d="M9 28 h2 v5 h-2 z" />
          <path d="M11 21 h2 v5 h-2 z" />
          <path d="M13 15 h1.5 v4 h-1.5 z" />

          {/* Side pillars detailing (right) */}
          <path d="M31 35 h2 v9 h-2 z" />
          <path d="M29 28 h2 v5 h-2 z" />
          <path d="M27 21 h2 v5 h-2 z" />
          <path d="M25.5 15 h1.5 v4 h-1.5 z" />
        </g>

        {/* Entrance Arch */}
        <path d="M15 44 v-8 a5 5 0 0 1 10 0 v8 z" fill="var(--color-maroon-900)" />
        
        {/* 'U' Namam inside the Arch */}
        <path d="M17.5 35 v4.5 a2.5 2.5 0 0 0 5 0 v-4.5 h-1.5 v4.5 a1 1 0 0 1 -2 0 v-4.5 z" fill="#fff" />
        {/* Center red/saffron line of the Namam */}
        <path d="M19.6 36.5 h0.8 v3 l-0.4 1.5 l-0.4 -1.5 z" fill="#E87A1D" />
      </svg>

      {showWordmark && (
        <span className={styles.wordmark}>
          <span
            className={styles.ttd}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: variant === 'white' ? '#FFFFFF' : '#4A0E1C',
              letterSpacing: '0.04em',
            }}
          >
            TTD
          </span>
          <span
            className={styles.yatra}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: variant === 'white' ? '#F3DE8A' : '#A87A00',
              letterSpacing: '0.04em',
            }}
          >
            YATRA
          </span>
        </span>
      )}

    </span>
  );
};

export default Logo;
