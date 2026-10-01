import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';
import paymentService from '../../services/paymentService';
import { setBookingId, setPaymentStatus } from '../../redux/slices/bookingSlice';
import Logo from '../../components/common/Logo/Logo';

const PaymentPending = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: paramId } = useParams();

  const bookingState = useSelector((state) => state.booking);
  const passedData = location.state || {};

  const pnr = passedData.pnr || bookingState.bookingNumber || paramId || 'TTY-PENDING';
  const amount = passedData.amount || 6458;
  const utr = passedData.utr || 'Under Verification';
  const paymentId = passedData.paymentId || 'PAY-VERIFY';

  const [checking, setChecking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({
    bookingStatus: 'payment_pending',
    paymentStatus: 'verification_pending',
  });

  const checkStatus = async (showToast = true) => {
    try {
      setChecking(true);
      const res = await paymentService.getBookingPayment(pnr);
      if (res?.data?.booking) {
        const b = res.data.booking;
        const p = res.data.currentPayment;

        setCurrentStatus({
          bookingStatus: b.bookingStatus,
          paymentStatus: b.paymentStatus,
        });

        if (b.bookingStatus === 'confirmed' || b.paymentStatus === 'paid') {
          dispatch(setBookingId({
            bookingId: b.bookingId || b._id,
            bookingNumber: b.pnr,
          }));
          dispatch(setPaymentStatus('completed'));
          toast.success('Your payment has been verified and booking is now confirmed! Govinda Govinda!');
          navigate(ROUTES.BOOKING_SUCCESS);
          return;
        }

        if (b.paymentStatus === 'failed' || p?.verificationStatus === 'rejected') {
          toast.error(`Payment was not verified: ${p?.failureReason || 'Please retry payment.'}`);
          navigate(ROUTES.PAYMENT_FAILED);
          return;
        }

        if (showToast) {
          toast('Payment reference is still under verification by admin.', { icon: '⏳' });
        }
      }
    } catch {
      if (showToast) toast.error('Could not refresh verification status. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  // Poll every 12 seconds while on this screen
  useEffect(() => {
    const timer = setInterval(() => checkStatus(false), 12000);
    return () => clearInterval(timer);
  }, [pnr]);

  return (
    <div className="section" style={{ minHeight: '85vh', background: 'radial-gradient(circle at 50% 10%, rgba(245, 158, 11, 0.08) 0%, transparent 60%), var(--bg-page)', padding: '40px 0 80px' }}>
      <div className="container">
        <div style={{
          maxWidth: '620px',
          margin: '0 auto',
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
          border: '1px solid #EAE0D5',
          textAlign: 'center',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Logo size="md" variant="default" showWordmark />
          </div>

          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #F59E0B',
            borderRadius: '24px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '16px',
          }}>
            <span style={{ animation: 'spin 3s linear infinite' }}>⏳</span>
            <span>Payment Verification Pending</span>
          </div>

          <h1 style={{ fontSize: '24px', color: '#4A0E1C', margin: '0 0 10px', fontFamily: 'Cinzel, serif' }}>
            Payment Reference Submitted
          </h1>

          <p style={{ color: '#6B615C', fontSize: '14px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 28px' }}>
            We have received your payment reference. Your Tirupati yatra booking will be marked as <strong>Confirmed</strong> immediately after payment verification by our accounts desk.
          </p>

          {/* Transaction Metadata Card */}
          <div style={{
            background: '#FAF7F2',
            border: '1px solid #EAE0D5',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '28px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#7A6E6A', textTransform: 'uppercase', display: 'block' }}>
                  Booking ID (PNR)
                </span>
                <strong style={{ fontSize: '16px', color: '#4A0E1C', fontFamily: 'monospace' }}>
                  {pnr}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#7A6E6A', textTransform: 'uppercase', display: 'block' }}>
                  Amount Submitted
                </span>
                <strong style={{ fontSize: '16px', color: '#2E7D46' }}>
                  ₹{Number(amount).toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#7A6E6A', textTransform: 'uppercase', display: 'block' }}>
                  Submitted UTR / Ref
                </span>
                <strong style={{ fontSize: '14px', color: '#3B0A17', fontFamily: 'monospace' }}>
                  {utr}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#7A6E6A', textTransform: 'uppercase', display: 'block' }}>
                  Booking Status
                </span>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#92400E',
                  background: '#FDE68A',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  display: 'inline-block',
                }}>
                  Payment Pending
                </span>
              </div>
            </div>
          </div>

          {/* Verification Timeline (#31) */}
          <div style={{ marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#4A0E1C', marginBottom: '12px' }}>
              Verification Progress Timeline:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2E7D46' }}>
                <span>✓</span>
                <span><strong>Booking Initiated:</strong> Reservation slot reserved ({pnr})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2E7D46' }}>
                <span>✓</span>
                <span><strong>Payment Submitted:</strong> UTR reference logged in audit ledger</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#B45309' }}>
                <span>⏳</span>
                <span><strong>Accounts Desk Verification:</strong> Matching with bank statement</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9A8580' }}>
                <span>⚪</span>
                <span><strong>Booking Confirmation:</strong> Voucher & Darshan QR released</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              disabled={checking}
              onClick={() => checkStatus(true)}
              className="btn btn-gold btn-lg"
              style={{ width: '100%' }}
            >
              {checking ? 'Checking Status with Server...' : 'Check Verification Status ↻'}
            </button>

            <Link
              to={ROUTES.DASHBOARD_BOOKINGS}
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '13px' }}
            >
              Go to My Bookings Ledger
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
