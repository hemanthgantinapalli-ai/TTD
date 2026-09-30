import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from './constants/routes';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './pages/dashboard/DashboardLayout';

// Public Pages
import Home from './pages/public/Home/Home';
import About from './pages/public/About/About';
import Services from './pages/public/Services/Services';
import Contact from './pages/public/Contact/Contact';
import FAQ from './pages/public/FAQ/FAQ';
import Gallery from './pages/public/Gallery/Gallery';
import DarshanGuide from './pages/public/DarshanGuide/DarshanGuide';
import TripAssistance from './pages/public/TripAssistance/TripAssistance';
import Terms from './pages/public/Terms/Terms';
import PrivacyPolicy from './pages/public/Terms/PrivacyPolicy';
import RefundPolicy from './pages/public/Terms/RefundPolicy';
import BlogsList from './pages/public/Blogs/BlogsList';
import BlogDetail from './pages/public/Blogs/BlogDetail';

// Hotels, Cars & Packages
import HotelsList from './pages/public/Hotels/HotelsList';
import HotelDetail from './pages/public/Hotels/HotelDetail';
import CarsList from './pages/public/Cars/CarsList';
import CarDetail from './pages/public/Cars/CarDetail';
import PackagesList from './pages/public/Packages/PackagesList';
import PackageDetail from './pages/public/Packages/PackageDetail';

// Auth Pages
import Login from './pages/public/Auth/Login';
import Register from './pages/public/Auth/Register';
import VerifyOtp from './pages/public/Auth/VerifyOtp';
import ForgotPassword from './pages/public/Auth/ForgotPassword';

// Booking & Checkout Flow
import TravellerDetails from './pages/booking/TravellerDetails';
import SelectDate from './pages/booking/SelectDate';
import BookingReview from './pages/booking/BookingReview';
import Payment from './pages/booking/Payment';
import BookingSuccess from './pages/booking/BookingSuccess';
import PaymentFailed from './pages/booking/PaymentFailed';
import DownloadInvoice from './pages/booking/DownloadInvoice';

// Devotee Dashboard Pages
import MyBookings from './pages/dashboard/MyBookings';
import Profile from './pages/dashboard/Profile';
import Wishlist from './pages/dashboard/Wishlist';
import Support from './pages/dashboard/Support';

// Admin Portal Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTerms from './pages/admin/AdminTerms';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPackages from './pages/admin/AdminPackages';
import AdminHotels from './pages/admin/AdminHotels';
import AdminCars from './pages/admin/AdminCars';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';

// Actions
import { getMe, setInitialized } from './redux/slices/authSlice';

const ProtectedAdminRoute = ({ children }) => {
  const { isInitialized, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) return null;
  if (!user) return <Navigate to={ROUTES.ADMIN_LOGIN} state={{ from: location }} replace />;
  if (user.role !== 'admin') return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { elderMode } = useSelector((state) => state.ui);
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('ttdyatra_token');
    if (token) {
      dispatch(getMe());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  // Apply elder mode initially if saved
  useEffect(() => {
    if (elderMode) {
      document.documentElement.setAttribute('data-elder', 'true');
    } else {
      document.documentElement.removeAttribute('data-elder');
    }
  }, [elderMode]);

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-ivory-bg)' }}>
        <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '4px' }} />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
        
        <Routes>
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
          {/* Admin Master Portal */}
          <Route path={ROUTES.ADMIN} element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="terms" element={<AdminTerms />} />
            <Route path="cms" element={<AdminTerms />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="hotels" element={<AdminHotels />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="marketing" element={<AdminEnquiries />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Public Layout Wrapping all main consumer routes */}
          <Route element={<PublicLayout />}>
            {/* Core Public */}
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.SERVICES} element={<Services />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.FAQ} element={<FAQ />} />
            <Route path={ROUTES.GALLERY} element={<Gallery />} />
            <Route path={ROUTES.DARSHAN_GUIDE} element={<DarshanGuide />} />
            <Route path={ROUTES.TRIP_ASSISTANCE} element={<TripAssistance />} />
            <Route path={ROUTES.TERMS} element={<Terms />} />
            <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
            <Route path={ROUTES.REFUND_POLICY} element={<RefundPolicy />} />

            {/* Blogs */}
            <Route path={ROUTES.BLOGS} element={<BlogsList />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />

            {/* Hotels */}
            <Route path={ROUTES.HOTELS} element={<HotelsList />} />
            <Route path={ROUTES.HOTELS_SEARCH} element={<HotelsList />} />
            <Route path="/hotels/:slug" element={<HotelDetail />} />

            {/* Cars */}
            <Route path={ROUTES.CARS} element={<CarsList />} />
            <Route path={ROUTES.CARS_SEARCH} element={<CarsList />} />
            <Route path="/cars/:slug" element={<CarDetail />} />

            {/* Packages */}
            <Route path={ROUTES.PACKAGES} element={<PackagesList />} />
            <Route path={ROUTES.PACKAGES_SEARCH} element={<PackagesList />} />
            <Route path="/packages/:slug" element={<PackageDetail />} />

            {/* Auth */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

            {/* Booking Flow */}
            <Route path={ROUTES.TRAVELLER_DETAILS} element={<TravellerDetails />} />
            <Route path={ROUTES.SELECT_DATE} element={<SelectDate />} />
            <Route path={ROUTES.BOOKING_REVIEW} element={<BookingReview />} />
            <Route path={ROUTES.PAYMENT} element={<Payment />} />
            <Route path={ROUTES.BOOKING_SUCCESS} element={<BookingSuccess />} />
            <Route path={ROUTES.PAYMENT_FAILED} element={<PaymentFailed />} />
            <Route path="/download-invoice/:id" element={<DownloadInvoice />} />

            {/* Devotee Dashboard */}
            <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />}>
              <Route index element={<Navigate to={ROUTES.DASHBOARD_BOOKINGS} replace />} />
              <Route path={ROUTES.DASHBOARD_HOME} element={<MyBookings />} />
              <Route path={ROUTES.DASHBOARD_BOOKINGS} element={<MyBookings />} />
              <Route path={ROUTES.DASHBOARD_UPCOMING} element={<MyBookings />} />
              <Route path={ROUTES.DASHBOARD_PAYMENTS} element={<MyBookings />} />
              <Route path={ROUTES.DASHBOARD_WISHLIST} element={<Wishlist />} />
              <Route path={ROUTES.DASHBOARD_PROFILE} element={<Profile />} />
              <Route path={ROUTES.DASHBOARD_SUPPORT} element={<Support />} />
              <Route path={ROUTES.DASHBOARD_NOTIFICATIONS} element={<Support />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={
              <div className="container section text-center" style={{ minHeight: '60vh', padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🕉️</div>
                <h1 style={{ fontSize: '28px', color: 'var(--color-maroon-900)' }}>404 - Page Not Found</h1>
                <p className="text-muted" style={{ maxWidth: '400px', margin: '8px auto 20px' }}>
                  The sacred page you are searching for does not exist or has been relocated.
                </p>
                <a href={ROUTES.HOME} className="btn btn-gold">Return to Home</a>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
