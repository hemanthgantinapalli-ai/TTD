import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../../redux/slices/authSlice';
import { ROUTES } from '../../constants/routes';
import Logo from '../../components/common/Logo/Logo';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isInitialized, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isInitialized && user?.role === 'admin') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await dispatch(loginAdmin({ email: email.trim(), password })).unwrap();
      navigate(location.state?.from?.pathname || ROUTES.ADMIN_DASHBOARD, { replace: true });
    } catch (message) {
      setError(message || 'Unable to connect to server');
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <Logo size="md" variant="default" showWordmark />
        </div>
        <p className={styles.eyebrow}>Sri Venkateswara Admin</p>
        <h1>Admin Control Center</h1>
        <p className={styles.intro}>Sign in with your authorized administrator account.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className={styles.passwordField}>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}
          <button className={styles.submit} type="submit" disabled={isLoading}>
            {isLoading ? 'Authenticating Admin...' : 'Login'}
          </button>
        </form>
        <a className={styles.publicLink} href={ROUTES.HOME}>Return to TTD Yatra</a>
      </section>
    </main>
  );
};

export default AdminLogin;