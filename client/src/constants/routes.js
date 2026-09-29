// Route constants — single source of truth for all app routes

export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  GALLERY: '/gallery',
  TESTIMONIALS: '/testimonials',
  FAQ: '/faq',
  CONTACT: '/contact',
  PRIVACY_POLICY: '/privacy-policy',
  REFUND_POLICY: '/refund-policy',
  TERMS: '/terms',

  // Hotels
  HOTELS: '/hotels',
  HOTELS_SEARCH: '/hotels/search',
  HOTEL_DETAIL: (slug) => `/hotels/${slug}`,
  HOTEL_ROOMS: (slug) => `/hotels/${slug}/room-selection`,

  // Cars
  CARS: '/cars',
  CARS_SEARCH: '/cars/search',
  CAR_DETAIL: (slug) => `/cars/${slug}`,

  // Packages
  PACKAGES: '/packages',
  PACKAGES_SEARCH: '/packages/search',
  PACKAGE_DETAIL: (slug) => `/packages/${slug}`,

  // Assistance
  TRIP_ASSISTANCE: '/trip-assistance',
  DARSHAN_GUIDE: '/darshan-guide',

  // Blogs
  BLOGS: '/blogs',
  BLOG_DETAIL: (slug) => `/blogs/${slug}`,

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Booking
  TRAVELLER_DETAILS: '/traveller-details',
  SELECT_DATE: '/select-date',
  BOOKING_REVIEW: '/booking-review',
  PAYMENT: '/payment',
  BOOKING_SUCCESS: '/booking-success',
  PAYMENT_FAILED: '/payment-failed',
  DOWNLOAD_INVOICE: (id) => `/download-invoice/${id}`,

  // Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_HOME: '/dashboard/home',
  DASHBOARD_BOOKINGS: '/dashboard/my-bookings',
  DASHBOARD_UPCOMING: '/dashboard/upcoming-trips',
  DASHBOARD_PAYMENTS: '/dashboard/payment-history',
  DASHBOARD_INVOICES: '/dashboard/invoices',
  DASHBOARD_WISHLIST: '/dashboard/wishlist',
  DASHBOARD_REVIEWS: '/dashboard/reviews',
  DASHBOARD_SUPPORT: '/dashboard/support',
  DASHBOARD_NOTIFICATIONS: '/dashboard/notifications',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_CHANGE_PASSWORD: '/dashboard/change-password',

  // Admin
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_HOTELS: '/admin/hotels',
  ADMIN_ROOMS: '/admin/rooms',
  ADMIN_CARS: '/admin/cars',
  ADMIN_DRIVERS: '/admin/drivers',
  ADMIN_PACKAGES: '/admin/packages',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_USERS: '/admin/users',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_CMS: '/admin/cms',
  ADMIN_MARKETING: '/admin/marketing',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_LOGS: '/admin/logs',

  // Errors
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
};

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
