import React from 'react';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import styles from './Booking.module.css';

const STEPS = [
  { step: 1, label: 'Devotee Info' },
  { step: 2, label: 'Date & Slot' },
  { step: 3, label: 'Review & Addons' },
  { step: 4, label: 'Payment' },
  { step: 5, label: 'Voucher' },
];

const STEP_LABELS = {
  1: 'Traveller Details',
  2: 'Choose Date & Slot',
  3: 'Review Booking',
  4: 'Payment',
  5: 'Confirmation',
};

const BookingLayout = ({ currentStep = 1, children }) => {
  const { currentBooking } = useSelector((state) => state.booking);
  const bookingItem = currentBooking.itemData;

  const pageTitle =
    currentBooking.type === 'hotel'
      ? `Hotel Booking: ${bookingItem?.name || 'Hotel Stay'}`
      : currentBooking.type === 'car'
      ? `Cab Rental: ${bookingItem?.name || 'Cab Service'}`
      : currentBooking.type === 'package'
      ? `Yatra Package: ${bookingItem?.title || 'Pilgrimage Package'}`
      : 'Tirumala Pilgrimage Booking';

  return (
    <div className="booking-layout">
      {/* Reusable PageHeader with Breadcrumbs */}
      <PageHeader
        eyebrow="SACRED JOURNEY RESERVATION"
        title={pageTitle}
        subtitle="Complete pilgrimage reservation with confirmed darshan assistance"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Booking', path: ROUTES.PACKAGES },
          { label: STEP_LABELS[currentStep] || 'Checkout' },
        ]}
      />

      {/* Stepper Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #EAE0D5', padding: '16px 0' }}>
        <div className="container">
          <div className={styles.stepper}>
            {STEPS.map((s, idx) => {
              const isCompleted = s.step < currentStep;
              const isActive = s.step === currentStep;

              return (
                <React.Fragment key={s.step}>
                  <div
                    className={`${styles.stepItem} ${isActive ? styles.stepItemActive : ''} ${isCompleted ? styles.stepItemCompleted : ''}`}
                  >
                    <div
                      className={`${styles.stepNumber} ${isActive ? styles.stepNumberActive : ''} ${isCompleted ? styles.stepNumberCompleted : ''}`}
                    >
                      {isCompleted ? '✓' : s.step}
                    </div>
                    <span style={{ display: 'none' }} className="sm-show">{s.label}</span>
                  </div>
                  {idx < STEPS.length - 1 && <div className={styles.stepDivider} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container section">
        {children}
      </div>
    </div>
  );
};

export default BookingLayout;
