import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import BookingLayout from './BookingLayout';
import { setBookingId, setPaymentStatus } from '../../redux/slices/bookingSlice';
import { ROUTES } from '../../constants/routes';
import styles from './Booking.module.css';

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBooking, selectedDate, travellers, addOns, couponDiscount, guests, selectedRoom } = useSelector((state) => state.booking);

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Compute final price
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
  const addonsTotal = addOns.reduce((sum, item) => sum + item.price, 0);
  const gstAmount = Math.round((basePrice + addonsTotal) * 0.05);
  const totalAmount = Math.max(0, basePrice + addonsTotal + gstAmount - couponDiscount);

  const handleExecutePayment = (status = 'success') => {
    setIsProcessing(true);
    const toastId = toast.loading('Processing payment securely with bank gateway...');

    setTimeout(() => {
      setIsProcessing(false);
      toast.dismiss(toastId);

      if (status === 'success') {
        const bookingNum = `TTY-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        dispatch(setBookingId({
          bookingId: 'bk_' + Date.now(),
          bookingNumber: bookingNum,
        }));
        dispatch(setPaymentStatus('completed'));
        toast.success('Payment Received! Govinda Govinda.');
        navigate(ROUTES.BOOKING_SUCCESS);
      } else {
        dispatch(setPaymentStatus('failed'));
        toast.error('Payment was declined by bank gateway.');
        navigate(ROUTES.PAYMENT_FAILED);
      }
    }, 1200);
  };

  return (
    <BookingLayout currentStep={4}>
      <div className={styles.bookingGrid}>
        <div className={styles.formCard}>
          <div style={{ marginBottom: '24px' }}>
            <span className="badge badge-maroon">Step 4 of 5</span>
            <h2 style={{ fontSize: '22px', color: 'var(--color-maroon-900)', marginTop: '6px' }}>
              Choose Payment Method
            </h2>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              256-bit encrypted SSL payment processing for your Tirumala yatra reservation.
            </p>
          </div>

          {/* Payment Method Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { id: 'upi', label: '📱 UPI / QR Code', desc: 'GPay, PhonePe, Paytm' },
              { id: 'card', label: '💳 Credit / Debit Card', desc: 'Visa, MasterCard, RuPay' },
              { id: 'netbanking', label: '🏦 Net Banking', desc: 'SBI, HDFC, ICICI, etc.' },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                className={`btn btn-sm ${paymentMethod === method.id ? 'btn-maroon' : 'btn-outline'}`}
                onClick={() => setPaymentMethod(method.id)}
                style={{ flex: 1, minWidth: '140px' }}
              >
                {method.label}
              </button>
            ))}
          </div>

          {/* UPI Method View */}
          {paymentMethod === 'upi' && (
            <div style={{ background: 'var(--color-sandal-100)', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
                Scan UPI QR Code to Pay ₹{totalAmount.toLocaleString('en-IN')}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Scan using Google Pay, PhonePe, Paytm, BHIM, or any banking app.
              </p>

              {/* Dynamic QR Code Mock */}
              <div style={{ background: '#fff', padding: '16px', display: 'inline-block', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xs)' }}>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=yatrattd@icici&pn=TTDYatra&am=2499&cu=INR"
                  alt="UPI QR Code"
                  style={{ width: '160px', height: '160px' }}
                />
              </div>

              <div style={{ margin: '16px auto 0', maxWidth: '300px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Or enter your UPI VPA ID:</span>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. devotee@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{ marginTop: '6px', textAlign: 'center' }}
                />
              </div>
            </div>
          )}

          {/* Card Method View */}
          {paymentMethod === 'card' && (
            <div style={{ background: 'var(--color-sandal-100)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="formLabel" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="4532 •••• •••• 8891"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="formLabel" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Expiry (MM/YY)
                    </label>
                    <input type="text" className="input" placeholder="12/28" maxLength={5} />
                  </div>
                  <div>
                    <label className="formLabel" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      CVV
                    </label>
                    <input type="password" className="input" placeholder="•••" maxLength={3} />
                  </div>
                </div>

                <div>
                  <label className="formLabel" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Name on Card
                  </label>
                  <input type="text" className="input" placeholder="Devotee Name" />
                </div>
              </div>
            </div>
          )}

          {/* Netbanking Method View */}
          {paymentMethod === 'netbanking' && (
            <div style={{ background: 'var(--color-sandal-100)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
              <label className="formLabel" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                Select Your Bank
              </label>
              <select className="input" defaultValue="sbi">
                <option value="sbi">State Bank of India (SBI)</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="other">Other Nationalized Bank</option>
              </select>
            </div>
          )}

          {/* Instant Simulation Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleExecutePayment('success')}
              className="btn btn-gold btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Verifying with Bank...' : `Pay ₹${totalAmount.toLocaleString('en-IN')} & Confirm Booking →`}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleExecutePayment('failure')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Simulate Failed Payment Flow (Testing)
            </button>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className={styles.sidebarSummary}>
          <span className="eyebrow">Checkout Amount</span>
          <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '16px' }}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </h3>

          <div style={{ background: 'var(--color-sandal-100)', padding: '16px', borderRadius: '8px', fontSize: '13px', color: 'var(--color-neutral-800)' }}>
            <div>📌 <strong>Item:</strong> {currentBooking.itemData?.name || currentBooking.itemData?.title || 'Pilgrimage Service'}</div>
            <div style={{ marginTop: '6px' }}>📅 <strong>Travel Date:</strong> {selectedDate || 'Upcoming'}</div>
            <div style={{ marginTop: '6px' }}>👤 <strong>Primary Pilgrim:</strong> {travellers.lead?.name || 'Devotee'}</div>
            <div style={{ marginTop: '6px' }}>📞 <strong>SMS / WhatsApp to:</strong> {travellers.lead?.phone || 'Provided Number'}</div>
          </div>
        </div>
      </div>
    </BookingLayout>
  );
};

export default Payment;
