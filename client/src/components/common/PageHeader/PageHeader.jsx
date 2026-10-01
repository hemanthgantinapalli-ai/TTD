import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './PageHeader.module.css';

/**
 * Common segment label map for auto-generated breadcrumbs
 */
const ROUTE_LABELS = {
  packages: 'Packages',
  hotels: 'Hotels',
  cars: 'Cars',
  about: 'About',
  contact: 'Contact',
  services: 'Services',
  gallery: 'Gallery',
  faq: 'FAQ',
  terms: 'Terms',
  login: 'Login',
  register: 'Register',
  booking: 'Booking',
  'booking-review': 'Review Booking',
  'traveller-details': 'Traveller Details',
  payment: 'Payment',
  'payment-pending': 'Payment Verification',
  'booking-success': 'Confirmation',
  'payment-failed': 'Payment Failed',
  'my-trips': 'My Trips',
  'my-bookings': 'My Trips',
  dashboard: 'Dashboard',
};

/**
 * Reusable PageHeader component for inner pages
 * Follows structure:
 *  - Eyebrow (small gold uppercase text)
 *  - Title (large elegant sanctum maroon heading)
 *  - Subtitle (dark muted brown/gray text)
 *  - Breadcrumb (Home / Parent / Current)
 */
const PageHeader = ({ eyebrow, title, subtitle, breadcrumbs, className = '' }) => {
  const location = useLocation();

  // If breadcrumbs prop is not provided, derive automatically from current URL
  const resolvedBreadcrumbs = React.useMemo(() => {
    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      return breadcrumbs;
    }

    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', path: '/' }];

    let accumulatedPath = '';
    segments.forEach((seg, index) => {
      accumulatedPath += `/${seg}`;
      const isLast = index === segments.length - 1;
      const knownLabel = ROUTE_LABELS[seg.toLowerCase()];
      const label = knownLabel || seg
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      crumbs.push({
        label,
        path: isLast ? undefined : accumulatedPath,
      });
    });

    return crumbs;
  }, [breadcrumbs, location.pathname]);

  return (
    <section className={`${styles.pageHeader} ${className}`} aria-label={title}>
      <div className={styles.inner}>
        {/* Eyebrow */}
        {eyebrow && (
          <span className={styles.eyebrow}>
            {eyebrow}
          </span>
        )}

        {/* Page Title */}
        <h1 className={styles.title}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        )}

        {/* Breadcrumb Navigation */}
        {resolvedBreadcrumbs && resolvedBreadcrumbs.length > 0 && (
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              {resolvedBreadcrumbs.map((crumb, index) => {
                const isLast = index === resolvedBreadcrumbs.length - 1;

                return (
                  <li key={`${crumb.label}-${index}`} className={styles.breadcrumbItem}>
                    {index > 0 && (
                      <span className={styles.separator} aria-hidden="true">
                        /
                      </span>
                    )}

                    {!isLast && crumb.path ? (
                      <Link to={crumb.path} className={styles.crumbLink}>
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={styles.crumbActive} aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
