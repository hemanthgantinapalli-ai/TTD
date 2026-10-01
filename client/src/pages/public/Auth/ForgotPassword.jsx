import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../constants/routes';
import Logo from '../../../components/common/Logo/Logo';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import styles from './Auth.module.css';

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone) {
      toast.error('Please enter your email or mobile number');
      return;
    }
    setSubmitted(true);
    toast.success('Password reset instructions sent!');
  };

  return (
    <div>
      <PageHeader
        eyebrow="ACCOUNT RECOVERY"
        title="RESET DEVOTEE PASSWORD"
        subtitle="We will send you instructions or an OTP to recover your pilgrim account."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Login', path: ROUTES.LOGIN },
          { label: 'Forgot Password' },
        ]}
      />
      <div className={styles.authContainer} style={{ minHeight: 'auto', padding: '36px 16px 64px' }}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <Logo size="md" variant="default" showWordmark />
            <h2 className={styles.authTitle}>Reset Password</h2>
            <p className={styles.authSubtitle}>Enter your details to receive recovery link</p>
          </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>✉️</div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
              Check Your Inbox / SMS
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A password reset link or OTP has been dispatched to <strong>{emailOrPhone}</strong>.
            </p>
            <Link to={ROUTES.LOGIN} className="btn btn-gold btn-sm" style={{ marginTop: '20px' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
                Registered Email or Mobile Number
              </label>
              <input
                type="text"
                className="input"
                placeholder="email@example.com or 10-digit mobile"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '8px' }}>
              Send Reset Link →
            </button>
          </form>
        )}

        <div className={styles.authFooter}>
          <Link to={ROUTES.LOGIN} style={{ color: 'var(--text-secondary)' }}>
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ForgotPassword;
