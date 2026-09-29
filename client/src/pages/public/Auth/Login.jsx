import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setCredentials } from '../../../redux/slices/authSlice';
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

  const redirectPath = location.state?.from || ROUTES.HOME;

  // 1-Click Demo Login
  const handleDemoLogin = (role = 'devotee') => {
    const demoUser = {
      _id: 'usr_demo_101',
      name: role === 'admin' ? 'Srinivasa Rao (Admin)' : 'Venkatesh Prasad',
      email: role === 'admin' ? 'admin@ttdyatra.com' : 'venkatesh@gmail.com',
      phone: '+91 98765 43210',
      role: role,
    };
    dispatch(setCredentials({
      user: demoUser,
      accessToken: 'demo_token_valid_jwt',
    }));
    toast.success(`Signed in successfully as ${demoUser.name}`);
    navigate(role === 'admin' ? ROUTES.ADMIN_DASHBOARD : redirectPath);
  };

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
    handleDemoLogin('devotee');
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Logo size="md" variant="default" showWordmark />
          <h1 className={styles.authTitle}>Sign In to TTD Yatra</h1>
          <p className={styles.authSubtitle}>Access your pilgrimage bookings, itinerary & vouchers</p>
        </div>

        {/* Demo Login Shortcut */}
        <div className={styles.demoBanner}>
          <div className={styles.demoText}>
            <strong>Test Devotee Account:</strong> 1-Click Instant Demo Login
          </div>
          <button
            type="button"
            className="btn btn-gold btn-sm"
            onClick={() => handleDemoLogin('devotee')}
          >
            Quick Sign In
          </button>
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
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '8px' }}>
              Sign In →
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
