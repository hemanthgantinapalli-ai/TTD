import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import BookingLayout from './BookingLayout';
import { applyCoupon, removeCoupon, addAddOn, removeAddOn } from '../../redux/slices/bookingSlice';
import { ROUTES } from '../../constants/routes';
import styles from './Booking.module.css';

const AVAILABLE_ADDONS = [
  {
    id: 'addon-laddu-box',
    title: 'Srivari Laddu Protection Carrier Box (5 Pack)',
    desc: 'Hygienic food-grade ventilated hard carrier box to safely carry sacred Laddus home without crushing.',
    price: 150,
  },
  {
    id: 'addon-puja-kit',
    title: 'Traditional Vedic Puja & Abhishekam Kit',
    desc: 'Fresh fragrant Tulasi malas, pure chandan, kumkum, and blessed camphor for offerings.',
    price: 350,
  },
  {
    id: 'addon-elder-care',
    title: 'Dedicated Elder / Wheelchair Companion Assistant',
    desc: 'Tirupati coordinator to accompany your elderly family members through the hill transit and queue entrance.',
    price: 600,
  },
];

const BookingReview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBooking, travellers, selectedDate, selectedSlot, selectedRoom, selectedVehicle, addOns, couponCode, couponDiscount, guests } = useSelector((state) => state.booking);

  const [inputCoupon, setInputCoupon] = useState(couponCode || '');

  // Base price calculation
  let basePrice = 2499;
  if (currentBooking.type === 'hotel') {
    basePrice = selectedRoom?.price || currentBooking.itemData?.pricePerNight || 3200;
  } else if (currentBooking.type === 'car') {
    basePrice = currentBooking.itemData?.pricePerDay || 2200;
  } else if (currentBooking.type === 'package') {
    const perPerson = currentBooking.itemData?.startingPrice || 2499;
    const count = (guests.adults || 1) + (guests.children || 0);
    basePrice = perPerson * count;
  }

  // Addons total
  const addonsTotal = addOns.reduce((sum, item) => sum + item.price, 0);

  // GST 5% on pilgrimage logistics
  const gstAmount = Math.round((basePrice + addonsTotal) * 0.05);

  // Discount
  const totalDiscount = couponDiscount;
  const finalAmount = Math.max(0, basePrice + addonsTotal + gstAmount - totalDiscount);

  const handleToggleAddon = (addon) => {
    const exists = addOns.some((a) => a.id === addon.id);
    if (exists) {
      dispatch(removeAddOn(addon.id));
      toast.success(`Removed ${addon.title}`);
    } else {
      dispatch(addAddOn(addon));
      toast.success(`Added ${addon.title}`);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = inputCoupon.trim().toUpperCase();
    if (code === 'GOVINDA10') {
      const disc = Math.round(basePrice * 0.1);
      dispatch(applyCoupon({ code: 'GOVINDA10', discount: disc }));
      toast.success('Coupon GOVINDA10 applied! (10% Off)');
    } else if (code === 'YATRA500') {
      dispatch(applyCoupon({ code: 'YATRA500', discount: 500 }));
      toast.success('Coupon YATRA500 applied! (₹500 Flat Off)');
    } else {
      toast.error('Invalid coupon code. Try GOVINDA10 or YATRA500');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setInputCoupon('');
    toast.success('Coupon removed');
  };

  const handleProceedPayment = () => {
    navigate(ROUTES.PAYMENT);
  };

  return (
    <BookingLayout currentStep={3}>
      <div className={styles.bookingGrid}>
        {/* Review & Addons Column */}
        <div className={styles.formCard}>
          <div style={{ marginBottom: '24px' }}>
            <span className="badge badge-maroon">Step 3 of 5</span>
            <h2 style={{ fontSize: '22px', color: 'var(--color-maroon-900)', marginTop: '6px' }}>
              Review Pilgrimage Summary & Add-ons
            </h2>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              Verify your booking details and customize with devotional add-ons before checkout.
            </p>
          </div>

          {/* Booking Info Card */}
          <div className="card" style={{ padding: '20px', background: 'var(--color-sandal-100)', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '4px' }}>
                  {currentBooking.type?.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)' }}>
                  {currentBooking.itemData?.name || currentBooking.itemData?.title || 'Pilgrimage Service'}
                </h3>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                📅 <strong>Date:</strong> {selectedDate || 'Not selected'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px', fontSize: '13px', color: 'var(--color-neutral-800)' }}>
              <div>👤 <strong>Lead:</strong> {travellers.lead?.name || 'Devotee'} ({travellers.lead?.phone || 'N/A'})</div>
              <div>👥 <strong>Group:</strong> {guests.adults} Adults{guests.children > 0 ? `, ${guests.children} Children` : ''}</div>
              <div>🕒 <strong>Slot:</strong> {selectedSlot || 'Morning'}</div>
              {selectedRoom && <div>🛏️ <strong>Room:</strong> {selectedRoom.name}</div>}
              {selectedVehicle && <div>🚗 <strong>Vehicle:</strong> {selectedVehicle.name}</div>}
            </div>
          </div>

          {/* Devotional Add-ons */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '14px' }}>
              ✨ Devotional Pilgrimage Add-ons
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {AVAILABLE_ADDONS.map((addon) => {
                const isSelected = addOns.some((a) => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon)}
                    className={`${styles.addonOption} ${isSelected ? styles.addonOptionSelected : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleAddon(addon)}
                        style={{ marginTop: '4px', accentColor: 'var(--color-maroon-900)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-maroon-900)' }}>
                          {addon.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {addon.desc}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, color: 'var(--color-maroon-900)', fontSize: '15px' }}>
                      +₹{addon.price}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coupon Section */}
          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--color-maroon-900)', marginBottom: '10px' }}>
              🏷️ Have a Pilgrimage Promo Code?
            </h4>

            {couponCode ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', padding: '12px 16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-success)', fontWeight: 600 }}>
                  ✓ Code {couponCode} applied (-₹{couponDiscount})
                </span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  style={{ color: 'var(--color-error)', fontSize: '13px', fontWeight: 600 }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter GOVINDA10 or YATRA500"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  style={{ textTransform: 'uppercase' }}
                />
                <button type="submit" className="btn btn-outline">
                  Apply Code
                </button>
              </form>
            )}
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              💡 Tip: Use coupon <strong>GOVINDA10</strong> for 10% off your booking.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.SELECT_DATE)}
              className="btn btn-ghost"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleProceedPayment}
              className="btn btn-gold btn-lg"
            >
              Proceed to Secure Payment →
            </button>
          </div>
        </div>

        {/* Sidebar Cost Breakdown */}
        <div className={styles.sidebarSummary}>
          <span className="eyebrow">Fare Summary</span>
          <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '16px' }}>
            Price Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Base Fare</span>
              <span>₹{basePrice.toLocaleString('en-IN')}</span>
            </div>

            {addOns.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Add-ons ({addOns.length})</span>
                <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Taxes & GST (5%)</span>
              <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>

            {totalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                <span>Coupon Discount</span>
                <span>-₹{totalDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-maroon-900)' }}>
              Total Payable
            </span>
            <span className="price" style={{ fontSize: '26px' }}>
              ₹{finalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ background: 'var(--color-sandal-100)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--color-neutral-700)', marginTop: '20px' }}>
            🛡️ <strong>100% Secure Checkout</strong><br />
            Instant booking voucher generated with official PNR barcode upon payment.
          </div>
        </div>
      </div>
    </BookingLayout>
  );
};

export default BookingReview;
