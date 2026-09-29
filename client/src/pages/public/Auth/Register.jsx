import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setCredentials } from '../../../redux/slices/authSlice';
import { ROUTES } from '../../../constants/routes';
import Logo from '../../../components/common/Logo/Logo';
import styles from './Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please enter your name and phone number');
      return;
    }

    const newUser = {
      _id: 'usr_' + Date.now(),
      name: formData.name,
      phone: `+91 ${formData.phone}`,
      email: formData.email,
      city: formData.city,
      role: 'devotee',
    };

    dispatch(setCredentials({
      user: newUser,
      accessToken: 'demo_token_valid_jwt',
    }));

    toast.success(`Welcome to TTD Yatra, ${formData.name}! Account registered successfully.`);
    navigate(ROUTES.HOME);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Logo size="md" variant="default" showWordmark />
          <h1 className={styles.authTitle}>Create Devotee Account</h1>
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
              Email Address
            </label>
            <input
              type="email"
              className="input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
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

          <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '8px' }}>
            Register & Continue →
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
  );
};

export default Register;
