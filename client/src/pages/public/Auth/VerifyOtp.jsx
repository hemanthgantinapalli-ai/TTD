import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setCredentials } from '../../../redux/slices/authSlice';
import { ROUTES } from '../../../constants/routes';
import Logo from '../../../components/common/Logo/Logo';
import styles from './Auth.module.css';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const phone = location.state?.phone || '9876543210';
  const redirectPath = location.state?.from || ROUTES.HOME;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length < 4) {
      toast.error('Please enter the verification code');
      return;
    }

    const user = {
      _id: 'usr_' + Date.now(),
      name: 'Devotee User',
      phone: `+91 ${phone}`,
      role: 'devotee',
    };

    dispatch(setCredentials({
      user,
      accessToken: 'demo_token_valid_jwt',
    }));

    toast.success('OTP verified successfully! Welcome.');
    navigate(redirectPath);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Logo size="md" variant="default" showWordmark />
          <h1 className={styles.authTitle}>Verify Mobile OTP</h1>
          <p className={styles.authSubtitle}>
            Enter the 6-digit code sent to <strong>+91 {phone.slice(-10)}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className={styles.authForm}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '12px 0' }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                style={{
                  width: '44px',
                  height: '52px',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: '700',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-paper)',
                  color: 'var(--color-maroon-900)',
                }}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '12px' }}>
            Verify & Sign In →
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Didn't receive code?{' '}
          <button
            type="button"
            onClick={() => toast.success('New OTP sent to your number')}
            style={{ color: 'var(--color-maroon-700)', fontWeight: 600 }}
          >
            Resend OTP
          </button>
        </div>

        <div className={styles.authFooter}>
          <Link to={ROUTES.LOGIN} style={{ color: 'var(--text-secondary)' }}>
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
