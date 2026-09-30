import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../../../redux/slices/authSlice';
import { ROUTES } from '../../../constants/routes';
import Logo from '../../../components/common/Logo/Logo';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'password'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = location.state?.from || ROUTES.HOME;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    toast.success(`OTP sent to +91 ${phone.slice(-10)}`);
    navigate(ROUTES.VERIFY_OTP, { state: { phone, from: redirectPath } });
  };

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    dispatch(login({ email, password }))
      .unwrap()
      .then(({ user }) => {
        toast.success('Signed in successfully');
        navigate(user?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : redirectPath);
      })
      .catch((error) => toast.error(error));
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Logo size="md" variant="default" showWordmark />
          <h1 className={styles.authTitle}>Sign In to TTD Yatra</h1>
          <p className={styles.authSubtitle}>Access your pilgrimage bookings, itinerary & vouchers</p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', background: 'var(--color-sandal-100)', borderRadius: '8px', padding: '3px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`btn btn-sm ${authMode === 'otp' ? 'btn-maroon' : 'btn-ghost'}`}
            style={{ flex: 1 }}
            onClick={() => setAuthMode('otp')}
          >
            Mobile OTP
          </button>
          <button
            type="button"
            className={`btn btn-sm ${authMode === 'password' ? 'btn-maroon' : 'btn-ghost'}`}
            style={{ flex: 1 }}
            onClick={() => setAuthMode('password')}
          >
            Email & Password
          </button>
        </div>

        {authMode === 'otp' ? (
          <form onSubmit={handleSendOtp} className={styles.authForm}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                Mobile Number
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ padding: '12px 14px', background: 'var(--color-sandal-100)', border: '1.5px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--color-neutral-800)' }}>
                  +91
                </span>
                <input
                  type="tel"
                  className="input"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '8px' }}>
              Send OTP →
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordLogin} className={styles.authForm}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                className="input"
                placeholder="devotee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)' }}>
                  Password
                </label>
                <Link to={ROUTES.FORGOT_PASSWORD} style={{ fontSize: '12px', color: 'var(--color-maroon-700)' }}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '42px', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: showPassword ? 'var(--color-maroon-800)' : 'var(--color-neutral-400)',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '8px' }} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>
        )}

        <div className={styles.authFooter}>
          Don't have an account yet?{' '}
          <Link to={ROUTES.REGISTER} style={{ color: 'var(--color-maroon-900)', fontWeight: 600 }}>
            Register as Devotee
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
