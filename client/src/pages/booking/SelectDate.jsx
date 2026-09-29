import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import BookingLayout from './BookingLayout';
import { setSelectedDate, setSelectedSlot, setGuests } from '../../redux/slices/bookingSlice';
import { ROUTES } from '../../constants/routes';
import styles from './Booking.module.css';

const TIME_SLOTS = [
  {
    id: 'early-morning',
    title: 'Early Morning Slot (04:00 AM - 08:00 AM)',
    desc: 'Ideal for Suprabhata Seva devotees, morning Alipiri trekking & early ghat road ascent.',
    badge: 'Fastest Darshan Queue',
  },
  {
    id: 'morning',
    title: 'Morning Slot (08:30 AM - 12:00 PM)',
    desc: 'Standard morning departure with breakfast stop at Tirupati.',
    badge: 'Recommended for Families',
  },
  {
    id: 'afternoon',
    title: 'Afternoon Slot (01:00 PM - 04:30 PM)',
    desc: 'Post-lunch ascent, covers Papavinasam & Akasa Ganga viewpoints before sunset.',
    badge: 'Scenic Mountain Views',
  },
  {
    id: 'evening',
    title: 'Evening Slot (05:30 PM - 09:00 PM)',
    desc: 'Night stay atop Tirumala or evening temple Aarti darshan.',
    badge: 'Cool Mountain Air',
  },
];

const SelectDate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBooking, selectedDate, selectedSlot, guests } = useSelector((state) => state.booking);

  const [date, setDate] = useState(selectedDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [slot, setSlot] = useState(selectedSlot || 'morning');
  const [adults, setAdults] = useState(guests.adults || 2);
  const [children, setChildren] = useState(guests.children || 0);

  const handleNext = (e) => {
    e.preventDefault();
    if (!date) {
      toast.error('Please select your pilgrimage travel date');
      return;
    }

    dispatch(setSelectedDate(date));
    dispatch(setSelectedSlot(slot));
    dispatch(setGuests({ adults, children }));
    navigate(ROUTES.BOOKING_REVIEW);
  };

  return (
    <BookingLayout currentStep={2}>
      <div className={styles.bookingGrid}>
        <div className={styles.formCard}>
          <div style={{ marginBottom: '24px' }}>
            <span className="badge badge-maroon">Step 2 of 5</span>
            <h2 style={{ fontSize: '22px', color: 'var(--color-maroon-900)', marginTop: '6px' }}>
              Select Travel Date & Reporting Slot
            </h2>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              Choose your preferred start date and vehicle / hotel arrival timing.
            </p>
          </div>

          <form onSubmit={handleNext}>
            {/* Date Picker */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                📅 Pilgrimage Start Date *
              </label>
              <input
                type="date"
                className="input"
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{ maxWidth: '320px' }}
              />
            </div>

            {/* Devotees Counter */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px', maxWidth: '400px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Adult Devotees (12+ yrs)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '16px', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                    {adults}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setAdults(adults + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '4px' }}>
                  Children (Below 12 yrs)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '16px', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                    {children}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setChildren(children + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Time Slot Selector */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-maroon-900)', display: 'block', marginBottom: '12px' }}>
                🕒 Preferred Pickup / Check-in Slot
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {TIME_SLOTS.map((s) => {
                  const isSelected = slot === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSlot(s.id)}
                      className={`${styles.addonOption} ${isSelected ? styles.addonOptionSelected : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <input
                          type="radio"
                          name="slot"
                          checked={isSelected}
                          onChange={() => setSlot(s.id)}
                          style={{ marginTop: '4px', accentColor: 'var(--color-maroon-900)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-maroon-900)' }}>
                            {s.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {s.desc}
                          </div>
                        </div>
                      </div>

                      <span className="badge badge-gold">{s.badge}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => navigate(ROUTES.TRAVELLER_DETAILS)}
                className="btn btn-ghost"
              >
                ← Back
              </button>
              <button type="submit" className="btn btn-gold btn-lg">
                Continue to Review & Addons →
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className={styles.sidebarSummary}>
          <span className="eyebrow">Trip Details</span>
          <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '16px' }}>
            {currentBooking.itemData?.name || currentBooking.itemData?.title || 'Pilgrimage Booking'}
          </h3>

          <div style={{ background: 'var(--color-sandal-100)', padding: '16px', borderRadius: '8px', fontSize: '13px', color: 'var(--color-neutral-800)' }}>
            <div>📅 <strong>Selected Date:</strong> {date || 'Not set'}</div>
            <div style={{ marginTop: '6px' }}>👥 <strong>Devotees:</strong> {adults} Adults, {children} Children</div>
            <div style={{ marginTop: '6px' }}>🕒 <strong>Reporting Slot:</strong> {TIME_SLOTS.find(s => s.id === slot)?.title.split('(')[0]}</div>
          </div>
        </div>
      </div>
    </BookingLayout>
  );
};

export default SelectDate;
