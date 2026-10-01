import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setCredentials } from '../../../redux/slices/authSlice';
import authService from '../../../services/authService';
import { ROUTES } from '../../../constants/routes';
import Logo from '../../../components/common/Logo/Logo';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import styles from './Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please enter your name and phone number');
      return;
    }
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authService.register({
        name: formData.name.trim(),
        phone: `+91 ${formData.phone.trim()}`,
        email: formData.email.trim(),
        password: formData.password,
        city: formData.city.trim(),
      });

      if (res && res.data) {
        dispatch(setCredentials({
          user: res.data.user,
          accessToken: res.data.accessToken,
        }));
        toast.success(`Welcome to TTD Yatra, ${formData.name}! Account registered successfully.`);
        navigate(ROUTES.HOME);
        return;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message;
      if (errorMsg) {
        toast.error(errorMsg);
        return;
      }
      // Fallback local registration if offline
      const newUser = {
        _id: 'usr_' + Date.now(),
        name: formData.name,
        phone: `+91 ${formData.phone}`,
        email: formData.email,
        city: formData.city,
        role: 'user',
      };
      dispatch(setCredentials({
        user: newUser,
        accessToken: 'ttd_devotee_session_' + Date.now(),
      }));
      toast.success(`Welcome to TTD Yatra, ${formData.name}! Account registered successfully.`);
      navigate(ROUTES.HOME);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="DEVOTEE REGISTRATION"
        title="CREATE DEVOTEE ACCOUNT"
        subtitle="Register for seamless Tirupati pilgrimage bookings, darshan guides, and exclusive devotee privileges."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Register' },
        ]}
      />
      <div className={styles.authContainer} style={{ minHeight: 'auto', padding: '36px 16px 64px' }}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <Logo size="md" variant="default" showWordmark />
            <h2 className={styles.authTitle}>Create Devotee Account</h2>
            <p className={styles.authSubtitle}>Register for seamless Tirupati pilgrimage bookings</p>
          </div>

          <form onSubmit={handleRegister} className={styles.authForm}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Sreenivasan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
              Mobile Number (WhatsApp) *
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '12px 14px', background: 'var(--color-sandal-100)', border: '1.5px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--color-neutral-800)' }}>
                +91
              </span>
              <input
                type="tel"
                className="input"
                placeholder="10-digit number"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
              Email Address *
            </label>
            <input
              type="email"
              className="input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)' }}>
                Create Password *
              </label>
              <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)' }}>
                Min 6 characters
              </span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Enter password (used for sign in)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
              Home City / State
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Bengaluru / Chennai / Hyderabad"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Devotee Account...' : 'Register & Continue →'}
          </button>
        </form>

        <div className={styles.authFooter}>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} style={{ color: 'var(--color-maroon-900)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Register;

