import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import BookingLayout from './BookingLayout';
import { setBookingId, setPaymentStatus } from '../../redux/slices/bookingSlice';
import { ROUTES } from '../../constants/routes';
import paymentService from '../../services/paymentService';
import phonepeQrImg from '../../assets/images/payment/phonepe-qr.png';
import styles from './Booking.module.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { currentBooking, selectedDate, travellers, addOns, couponDiscount, guests, selectedRoom, bookingNumber } = useSelector((state) => state.booking);

  const [paymentConfig, setPaymentConfig] = useState({
    upiId: 'ttdyatra@sbi',
    upiName: 'TTD Yatra Pilgrimage Services',
    paymentMode: 'test',
    razorpayEnabled: false,
    razorpayKeyId: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [showUtrForm, setShowUtrForm] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [payerUpiId, setPayerUpiId] = useState('');

  // Net banking bank
  const [selectedBank, setSelectedBank] = useState('sbi');

  // Backend Order State
  const [orderInfo, setOrderInfo] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

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
  const totalAmount = Math.max(0, basePrice + addonsTotal + gstAmount - (couponDiscount || 0));

  // 1. Fetch public payment config
  useEffect(() => {
    paymentService.getConfig().then((res) => {
      if (res?.data) {
        setPaymentConfig(res.data);
      }
    }).catch((err) => {
      console.warn('Payment config load warning:', err.message);
    });
  }, []);

  // 2. Initialize Booking & Payment Order in MongoDB (Rule #3: Create booking before payment with status 'payment_pending')
  const isOrderCreatedRef = useRef(false);

  useEffect(() => {
    if (isOrderCreatedRef.current) return;
    isOrderCreatedRef.current = true;

    const initializeOrder = async () => {
      setIsInitializing(true);
      try {
        const leadName = travellers?.lead?.name || user?.name || 'Devotee Guest';
        const leadPhone = travellers?.lead?.phone || user?.phone || '9876543210';
        const leadEmail = travellers?.lead?.email || user?.email || 'devotee@ttdyatra.com';
        const leadCity = travellers?.lead?.city || user?.city || 'India';
        const itemName = currentBooking?.itemData?.name || currentBooking?.itemData?.title || 'Tirupati Pilgrimage Package';
        const totalPax = (guests?.adults || 1) + (guests?.children || 0);

        const payload = {
          bookingId: currentBooking?.bookingId || currentBooking?._id || null,
          pnr: bookingNumber || null,
          type: currentBooking?.type || 'package',
          itemName,
          travelDate: selectedDate || new Date().toISOString().split('T')[0],
          travellers: totalPax,
          amount: totalAmount,
          customerDetails: {
            name: leadName,
            phone: leadPhone,
            email: leadEmail,
            city: leadCity,
          },
          leadPilgrim: {
            name: leadName,
            phone: leadPhone,
            email: leadEmail,
            city: leadCity,
          },
          method: paymentMethod,
          notes: `Reservation initiated for ${itemName} (${totalPax} Devotees)`,
        };

        const res = await paymentService.createOrder(payload);
        if (res?.data) {
          setOrderInfo(res.data);
          dispatch(setBookingId({
            bookingId: res.data.bookingId,
            bookingNumber: res.data.pnr,
          }));
          dispatch(setPaymentStatus('pending'));
        }
      } catch (err) {
        console.error('Failed to initialize booking order:', err);
        toast.error('Unable to initialize booking session. Please refresh or check details.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeOrder();
  }, [totalAmount, selectedDate]);

  // 3. Generate dynamic UPI QR Code with exact amount and deep link
  useEffect(() => {
    const pnrRef = orderInfo?.pnr || 'TTY-PENDING';
    const finalAmt = orderInfo?.amount || totalAmount;
    const upiString = `upi://pay?pa=${encodeURIComponent(paymentConfig.upiId)}&pn=${encodeURIComponent(paymentConfig.upiName)}&am=${finalAmt}&tn=${encodeURIComponent('Yatra ' + pnrRef)}&cu=INR`;

    QRCode.toDataURL(upiString, {
      width: 280,
      margin: 2,
      color: {
        dark: '#3B0A17',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => {
        console.warn('QR code generation warning:', err);
        setQrCodeDataUrl(phonepeQrImg);
      });
  }, [paymentConfig.upiId, paymentConfig.upiName, totalAmount, orderInfo?.pnr, orderInfo?.amount]);

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(paymentConfig.upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // ═══════════════════════════════════════════════════════════
  // FLOW A: UPI / QR Code Verification (Section 5, 6, 7)
  // ═══════════════════════════════════════════════════════════
  const handleIvePaidClick = () => {
    setShowUtrForm(true);
    toast('Please enter your 12-digit UPI UTR / Bank Reference Number below.', { icon: '📝' });
  };

  const handleUpiUtrSubmit = async (e) => {
    e.preventDefault();
    const cleanUtr = utrNumber.replace(/\s+/g, '').trim().toUpperCase();

    if (!cleanUtr) {
      toast.error('Please enter the 12-digit UTR / Bank Reference Number after paying.');
      return;
    }

    if (cleanUtr.length < 8) {
      toast.error('Please enter a valid 12-digit UPI Transaction Reference Number (min 8 characters).');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Submitting payment reference for verification...');
    const toastId = toast.loading('Submitting UTR to accounts desk...');

    try {
      const payload = {
        paymentId: orderInfo?.paymentId,
        orderId: orderInfo?.orderId,
        bookingId: orderInfo?.bookingId,
        pnr: orderInfo?.pnr,
        utr: cleanUtr,
      };

      const res = await paymentService.submitUtr(payload);

      toast.dismiss(toastId);
      toast.success('Payment submitted for verification. Booking status: Payment Verification Pending.', { duration: 6000 });

      dispatch(setPaymentStatus('verification_pending'));

      // Redirect to Payment Verification Pending Screen (Rule #6 & #21)
      // NEVER redirect to BOOKING_SUCCESS!
      navigate(ROUTES.PAYMENT_PENDING, {
        state: {
          pnr: orderInfo?.pnr,
          amount: orderInfo?.amount || totalAmount,
          utr: cleanUtr,
          paymentId: orderInfo?.paymentId,
        },
      });
    } catch (err) {
      toast.dismiss(toastId);
      const errMsg = err.response?.data?.message || 'Failed to submit payment reference. Please check your UTR number.';
      toast.error(errMsg);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // ═══════════════════════════════════════════════════════════
  // FLOW B: Card / Gateway Checkout (Section 14 & 18)
  // ═══════════════════════════════════════════════════════════
  const handleRazorpayGatewayLaunch = async () => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK is not loaded. Please use UPI QR Code or contact support.');
      return;
    }

    setIsProcessing(true);
    try {
      const options = {
        key: paymentConfig.razorpayKeyId,
        amount: Math.round((orderInfo?.amount || totalAmount) * 100),
        currency: 'INR',
        name: 'TTD Yatra Pilgrimage',
        description: `Tirupati Pilgrimage Booking (${orderInfo?.pnr})`,
        image: 'https://ttd-sable.vercel.app/favicon.svg',
        order_id: orderInfo?.gatewayOrderId || undefined,
        handler: async function (response) {
          setProcessingStatus('Verifying cryptographic payment signature with bank...');
          try {
            const verifyRes = await paymentService.verifyPayment({
              paymentId: orderInfo?.paymentId,
              orderId: orderInfo?.orderId,
              gatewayOrderId: response.razorpay_order_id,
              gatewayPaymentId: response.razorpay_payment_id,
              gatewaySignature: response.razorpay_signature,
            });

            if (verifyRes?.success) {
              dispatch(setPaymentStatus('completed'));
              toast.success('Payment verified! Booking confirmed. Govinda Govinda!');
              navigate(ROUTES.BOOKING_SUCCESS);
            }
          } catch (verErr) {
            toast.error(verErr.response?.data?.message || 'Signature verification failed.');
            navigate(ROUTES.PAYMENT_FAILED);
          }
        },
        prefill: {
          name: travellers?.lead?.name || user?.name || '',
          email: travellers?.lead?.email || user?.email || '',
          contact: travellers?.lead?.phone || user?.phone || '',
        },
        theme: {
          color: '#4A0E1C',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (failRes) {
        toast.error(`Payment failed: ${failRes.error?.description || 'Declined by bank'}`);
        navigate(ROUTES.PAYMENT_FAILED);
      });
      rzp.open();
    } catch (err) {
      toast.error('Could not initialize gateway checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // FLOW C: Test Mode Simulation Controls (Section 32)
  // Only available when PAYMENT_MODE === 'test'
  // ═══════════════════════════════════════════════════════════
  const handleTestScenario = async (scenario) => {
    if (paymentConfig.paymentMode !== 'test') {
      toast.error('Simulator is strictly disabled in live production mode.');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus(`Executing test scenario: ${scenario}...`);
    const toastId = toast.loading(`Running test simulation (${scenario})...`);

    try {
      const res = await paymentService.verifyPayment({
        paymentId: orderInfo?.paymentId,
        orderId: orderInfo?.orderId,
        scenario,
      });

      toast.dismiss(toastId);

      if (scenario === 'success') {
        dispatch(setPaymentStatus('completed'));
        toast.success('Test payment verified! Booking confirmed.');
        navigate(ROUTES.BOOKING_SUCCESS);
      } else {
        toast.error(`Test payment failed (${scenario}). Booking remains unconfirmed.`);
        navigate(ROUTES.PAYMENT_FAILED);
      }
    } catch (err) {
      toast.dismiss(toastId);
      const errMsg = err.response?.data?.message || `Payment ${scenario}`;
      toast.error(errMsg);
      if (scenario !== 'success') {
        navigate(ROUTES.PAYMENT_FAILED);
      }
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const isTestMode = paymentConfig.paymentMode === 'test';
  const effectiveAmount = orderInfo?.amount || totalAmount;

  return (
    <BookingLayout currentStep={4}>
      <div className={styles.bookingGrid}>
        <div className={styles.formCard}>
          {/* Header */}
          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-maroon">Step 4 of 5</span>
            <h2 style={{ fontSize: '22px', color: 'var(--color-maroon-900)', marginTop: '6px' }}>
              Choose Payment Method
            </h2>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              🔒 Secure payment processing. Bookings are confirmed upon backend verification.
            </p>
          </div>

          {/* Payment Lifecycle Timeline (Section 31) */}
          <div style={{
            background: '#FAF7F2',
            border: '1px solid #EAE0D5',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '11.5px',
          }}>
            <div style={{ fontWeight: 700, color: '#4A0E1C', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Payment Verification Timeline
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2E7D46', fontWeight: 600 }}>
                <span>✓</span> Booking Created
              </div>
              <span style={{ color: '#D8CBB8' }}>→</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#B45309', fontWeight: 700 }}>
                <span>⏳</span> Payment Pending
              </div>
              <span style={{ color: '#D8CBB8' }}>→</span>
              <div style={{ color: '#7A6E6A' }}>
                Payment Submitted
              </div>
              <span style={{ color: '#D8CBB8' }}>→</span>
              <div style={{ color: '#7A6E6A' }}>
                Admin / Gateway Verification
              </div>
              <span style={{ color: '#D8CBB8' }}>→</span>
              <div style={{ color: '#7A6E6A' }}>
                Confirmed
              </div>
            </div>
          </div>

          {/* Payment Method Selector Tabs (Section 4) */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { id: 'upi', label: '📱 UPI / QR Code' },
              { id: 'card', label: '💳 Credit / Debit Card' },
              { id: 'netbanking', label: '🏦 Net Banking' },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                className={`btn btn-sm ${paymentMethod === method.id ? 'btn-maroon' : 'btn-outline'}`}
                onClick={() => {
                  setPaymentMethod(method.id);
                  setShowUtrForm(false);
                }}
                style={{ flex: 1, minWidth: '130px', padding: '10px 14px', fontWeight: 600 }}
              >
                {method.label}
              </button>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════════
             1. UPI / QR CODE METHOD (Section 5, 6, 7, 16, 17)
             ═══════════════════════════════════════════════════════════ */}
          {paymentMethod === 'upi' && (
            <div>
              <div style={{
                background: '#FAF7F2',
                border: '1.5px solid #EAE0D5',
                borderRadius: '14px',
                padding: '24px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#E8F5EE',
                    color: '#2E7D46',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '12px',
                  }}>
                    <span>✓</span> Verified Merchant QR • Amount: ₹{effectiveAmount.toLocaleString('en-IN')}
                  </div>

                  {/* QR Code Display */}
                  <div style={{
                    background: '#FFFFFF',
                    padding: '14px',
                    borderRadius: '16px',
                    border: '2px solid #E3C05C',
                    boxShadow: '0 8px 24px rgba(59, 10, 23, 0.08)',
                    marginBottom: '14px',
                  }}>
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="Dynamic UPI Payment QR Code"
                        style={{
                          width: '240px',
                          height: '240px',
                          display: 'block',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <div style={{ width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Loading QR Code...
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '13.5px', color: '#4A0E1C', fontWeight: 600, margin: '0 0 6px 0' }}>
                    Scan with PhonePe, Google Pay, Paytm, or Any UPI App
                  </p>
                  <p style={{ fontSize: '12px', color: '#7A6E6A', margin: '0 0 16px 0', maxWidth: '380px' }}>
                    Scan QR or pay to the official pilgrimage merchant UPI ID below.
                  </p>

                  {/* Payment Metadata Display (Section 5) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '8px',
                    width: '100%',
                    maxWidth: '460px',
                    background: '#FFFFFF',
                    border: '1px solid #D8CBB8',
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '16px',
                    textAlign: 'left',
                    fontSize: '12px',
                  }}>
                    <div>
                      <span style={{ color: '#7A6E6A', display: 'block', fontSize: '10.5px' }}>AMOUNT</span>
                      <strong style={{ color: '#2E7D46', fontSize: '14px' }}>₹{effectiveAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#7A6E6A', display: 'block', fontSize: '10.5px' }}>BOOKING ID</span>
                      <strong style={{ color: '#4A0E1C', fontFamily: 'monospace' }}>{orderInfo?.pnr || 'Generating...'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#7A6E6A', display: 'block', fontSize: '10.5px' }}>PAYMENT ID</span>
                      <strong style={{ color: '#4A0E1C', fontFamily: 'monospace' }}>{orderInfo?.paymentId || 'Generating...'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#7A6E6A', display: 'block', fontSize: '10.5px' }}>REFERENCE</span>
                      <strong style={{ color: '#4A0E1C', fontFamily: 'monospace' }}>{orderInfo?.orderId || 'Generating...'}</strong>
                    </div>
                  </div>

                  {/* UPI ID Pill with Copy button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #D8CBB8',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '14px',
                  }}>
                    <span style={{ color: '#7A6E6A', fontSize: '12px' }}>UPI ID:</span>
                    <strong style={{ color: '#3B0A17' }}>{paymentConfig.upiId}</strong>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      style={{
                        background: copiedUpi ? '#2E7D46' : '#FAF0F2',
                        color: copiedUpi ? '#FFFFFF' : '#4A0E1C',
                        border: '1px solid ' + (copiedUpi ? '#2E7D46' : '#C9A227'),
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedUpi ? 'Copied! ✓' : 'Copy'}
                    </button>
                  </div>

                  {/* Direct Mobile UPI Intent Button */}
                  <a
                    href={`upi://pay?pa=${encodeURIComponent(paymentConfig.upiId)}&pn=${encodeURIComponent(paymentConfig.upiName)}&am=${effectiveAmount}&tn=TTD-Yatra-Reservation&cu=INR`}
                    className="btn btn-outline btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12.5px',
                      color: '#4A0E1C',
                      borderColor: '#4A0E1C',
                      textDecoration: 'none',
                      marginBottom: '16px',
                    }}
                  >
                    <span>📱</span> Pay via Installed UPI App (Mobile Only)
                  </a>

                  {/* Section 5: [ I've Paid ] Button (MUST NOT auto-confirm!) */}
                  {!showUtrForm && (
                    <button
                      type="button"
                      onClick={handleIvePaidClick}
                      disabled={isInitializing}
                      className="btn btn-gold btn-lg"
                      style={{ width: '100%', maxWidth: '460px', fontSize: '15px', fontWeight: 700 }}
                    >
                      I've Paid (₹{effectiveAmount.toLocaleString('en-IN')}) → Enter UTR
                    </button>
                  )}
                </div>

                {/* Section 5 & 17: Payment Verification Form revealed upon clicking [ I've Paid ] */}
                {showUtrForm && (
                  <form onSubmit={handleUpiUtrSubmit} style={{
                    marginTop: '20px',
                    borderTop: '2px dashed #D8CBB8',
                    paddingTop: '20px',
                  }}>
                    <div style={{
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      fontSize: '12.5px',
                      color: '#92400E',
                    }}>
                      <strong>📋 Verification Requirement:</strong> Please submit your 12-digit UTR reference number from your payment receipt. Your booking will remain in <strong>Payment Verification Pending</strong> status until verified by our accounts desk.
                    </div>

                    <label className="formLabel" style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#3B0A17' }}>
                      Payment Verification: Enter 12-Digit UTR / Transaction Reference <span style={{ color: '#B3261E' }}>*</span>
                    </label>
                    <p style={{ fontSize: '11.5px', color: '#7A6E6A', margin: '0 0 10px 0' }}>
                      Found under transaction details in Google Pay, PhonePe, Paytm, or BHIM as "UPI Ref ID" or "UTR".
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '14px' }}>
                      <input
                        type="text"
                        className="input"
                        required
                        placeholder="e.g. 429381729384 (12 digits)"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 16))}
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          letterSpacing: '1px',
                          borderColor: utrNumber.length >= 10 ? '#2E7D46' : undefined,
                        }}
                      />
                      <input
                        type="text"
                        className="input"
                        placeholder="Your UPI ID or Mobile (Optional, e.g. devotee@okhdfcbank)"
                        value={payerUpiId}
                        onChange={(e) => setPayerUpiId(e.target.value)}
                        style={{ fontSize: '13px' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || !utrNumber || utrNumber.trim().length < 8}
                      className="btn btn-gold btn-lg"
                      style={{ width: '100%', fontSize: '15px', fontWeight: 700 }}
                    >
                      {isProcessing ? (processingStatus || 'Submitting Reference...') : 'Submit UTR for Verification →'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
             2. CREDIT / DEBIT CARD METHOD (Section 18)
             ═══════════════════════════════════════════════════════════ */}
          {paymentMethod === 'card' && (
            <div style={{ background: '#FAF7F2', padding: '24px', borderRadius: '14px', border: '1.5px solid #EAE0D5', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>💳</div>
                <h3 style={{ fontSize: '17px', color: '#3B0A17', margin: '0 0 6px 0' }}>
                  Secure Gateway Card Checkout
                </h3>
                <p style={{ fontSize: '13px', color: '#6B615C', margin: 0, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                  Card payments are processed securely through 256-bit encrypted PCI-DSS compliant gateway. Sensitive card details are never stored on our servers.
                </p>
              </div>

              {/* Real Gateway (Razorpay) Launch if configured */}
              {paymentConfig.razorpayEnabled && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={handleRazorpayGatewayLaunch}
                    disabled={isProcessing || isInitializing}
                    className="btn btn-maroon btn-lg"
                    style={{ width: '100%', fontSize: '15px', fontWeight: 700 }}
                  >
                    {isProcessing ? 'Launching Gateway...' : `Pay ₹${effectiveAmount.toLocaleString('en-IN')} via Razorpay Secure Gateway →`}
                  </button>
                </div>
              )}

              {/* Section 32: Test Mode Simulator */}
              {isTestMode && (
                <div style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #E3C05C',
                  borderRadius: '12px',
                  padding: '18px',
                  marginTop: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="badge badge-gold" style={{ fontSize: '11px', fontWeight: 700 }}>
                      TEST MODE ONLY (Sandbox Simulator)
                    </span>
                    <span style={{ fontSize: '11px', color: '#7A6E6A' }}>PAYMENT_MODE=test</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B615C', marginBottom: '14px' }}>
                    Simulate real-world bank checkout scenarios for local development without real funds:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleTestScenario('success')}
                      className="btn btn-sm"
                      style={{ background: '#2E7D46', color: '#FFFFFF', borderColor: '#2E7D46', fontWeight: 600 }}
                    >
                      ✓ Simulate Success
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleTestScenario('failure')}
                      className="btn btn-sm btn-outline"
                      style={{ color: '#B3261E', borderColor: '#B3261E', fontWeight: 600 }}
                    >
                      ✕ Simulate Failure
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleTestScenario('cancelled')}
                      className="btn btn-sm btn-outline"
                      style={{ color: '#7A6E6A', fontWeight: 600 }}
                    >
                      ⏸ Simulate Cancelled
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleTestScenario('timeout')}
                      className="btn btn-sm btn-outline"
                      style={{ color: '#B45309', borderColor: '#F59E0B', fontWeight: 600 }}
                    >
                      ⏳ Simulate Timeout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
             3. NET BANKING METHOD (Section 19)
             ═══════════════════════════════════════════════════════════ */}
          {paymentMethod === 'netbanking' && (
            <div style={{ background: '#FAF7F2', padding: '24px', borderRadius: '14px', border: '1.5px solid #EAE0D5', marginBottom: '24px' }}>
              <label className="formLabel" style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px', color: '#3B0A17' }}>
                Select Your Bank for Internet Banking
              </label>
              <select
                className="input"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                style={{ marginBottom: '14px' }}
              >
                <option value="sbi">State Bank of India (SBI)</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="pnb">Punjab National Bank (PNB)</option>
                <option value="canara">Canara Bank</option>
                <option value="union">Union Bank of India</option>
                <option value="bob">Bank of Baroda</option>
              </select>

              <p style={{ fontSize: '12px', color: '#7A6E6A', margin: '0 0 16px 0' }}>
                You will be routed to your bank's authenticated gateway. No bank credentials or OTPs are requested on this site.
              </p>

              {paymentConfig.razorpayEnabled ? (
                <button
                  type="button"
                  onClick={handleRazorpayGatewayLaunch}
                  disabled={isProcessing || isInitializing}
                  className="btn btn-gold btn-lg"
                  style={{ width: '100%', fontSize: '15px', fontWeight: 700 }}
                >
                  {isProcessing ? 'Connecting to Bank...' : `Proceed to ${selectedBank.toUpperCase()} Net Banking →`}
                </button>
              ) : isTestMode ? (
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #D8CBB8',
                  borderRadius: '10px',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 700, marginBottom: '10px' }}>
                    TEST MODE: Net Banking Gateway Simulator
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleTestScenario('success')}
                      className="btn btn-sm btn-gold"
                      style={{ flex: 1, fontWeight: 700 }}
                    >
                      Authorize {selectedBank.toUpperCase()} (Success)
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleTestScenario('failure')}
                      className="btn btn-sm btn-outline"
                      style={{ flex: 1, color: '#B3261E', borderColor: '#B3261E' }}
                    >
                      Decline (Failed)
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#B3261E', fontSize: '12.5px' }}>
                  Gateway is currently offline for direct netbanking. Please use UPI / QR Code above.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className={styles.sidebarSummary}>
          <span className="eyebrow">Checkout Amount</span>
          <h3 style={{ fontSize: '20px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '16px' }}>
            ₹{effectiveAmount.toLocaleString('en-IN')}
          </h3>

          <div style={{ background: 'var(--color-sandal-100)', padding: '16px', borderRadius: '10px', fontSize: '13px', color: 'var(--color-neutral-800)', border: '1px solid #EAE0D5' }}>
            <div>📌 <strong>Item:</strong> {currentBooking.itemData?.name || currentBooking.itemData?.title || 'Pilgrimage Service'}</div>
            <div style={{ marginTop: '8px' }}>📅 <strong>Travel Date:</strong> {selectedDate || 'Upcoming'}</div>
            <div style={{ marginTop: '8px' }}>👤 <strong>Primary Devotee:</strong> {travellers.lead?.name || user?.name || 'Devotee'}</div>
            <div style={{ marginTop: '8px' }}>📞 <strong>Contact Phone:</strong> {travellers.lead?.phone || user?.phone || 'Provided Number'}</div>
            <div style={{ marginTop: '8px' }}>🎟️ <strong>Booking ID (PNR):</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4A0E1C' }}>{orderInfo?.pnr || 'Generating...'}</span></div>
            <div style={{ marginTop: '6px' }}>💳 <strong>Payment ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '11.5px' }}>{orderInfo?.paymentId || 'Pending'}</span></div>
            <div style={{ marginTop: '6px' }}>📋 <strong>Order ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '11.5px' }}>{orderInfo?.orderId || 'Pending'}</span></div>
          </div>

          <div style={{ marginTop: '16px', padding: '12px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #EAE0D5', fontSize: '12px', color: '#4A0E1C', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '16px' }}>🛡️</span>
            <span>Manual UPI submissions are verified by accounts desk before booking confirmation.</span>
          </div>
        </div>
      </div>
    </BookingLayout>
  );
};

export default Payment;
