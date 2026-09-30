import React from 'react';
import officialLogo from '../../../assets/images/logo/ttd-yatra-logo.png';
import styles from './Logo.module.css';

/**
 * TTD YATRA Official Logo
 * Displays the authentic golden Tirumala gopuram with Namam and TTD YATRA wordmark.
 */
const Logo = ({
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <span className={`${styles.logo} ${styles[`logo--${size}`]} ${className}`} {...props}>
      <img
        src={officialLogo}
        alt="TTD YATRA — Sacred Pilgrimage"
        className={styles.logoImage}
        loading="eager"
        draggable={false}
      />
    </span>
  );
};

export default Logo;
