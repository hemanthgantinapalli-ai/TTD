import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './Booking.module.css';

const STEPS = [
  { step: 1, label: 'Devotee Info' },
  { step: 2, label: 'Date & Slot' },
  { step: 3, label: 'Review & Addons' },
  { step: 4, label: 'Payment' },
  { step: 5, label: 'Voucher' },
];

const BookingLayout = ({ currentStep = 1, children }) => {
  const { currentBooking, selectedRoom, selectedVehicle } = useSelector((state) => state.booking);
  const bookingItem = currentBooking.itemData;

  return (
    <div className="booking-layout">
      {/* Header & Stepper */}
      <div className={styles.bookingHeader}>
        <div className="container">
          <span className="eyebrow">Sacred Journey Reservation</span>
          <h1 className="text-maroon font-display" style={{ fontSize: '24px', marginTop: '4px' }}>
            {currentBooking.type === 'hotel' && `Hotel Booking: ${bookingItem?.name || 'Hotel Stay'}`}
            {currentBooking.type === 'car' && `Cab Rental: ${bookingItem?.name || 'Cab Service'}`}
            {currentBooking.type === 'package' && `Yatra Package: ${bookingItem?.title || 'Pilgrimage Package'}`}
            {!currentBooking.type && 'Tirumala Pilgrimage Booking'}
          </h1>

          {/* Stepper Bar */}
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
