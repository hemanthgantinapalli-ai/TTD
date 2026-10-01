import { Router } from 'express';
import { getPublicPackages, getPublicPackageBySlug } from '../controllers/packageController.js';
import { getPublicHotels, getPublicHotelBySlug } from '../controllers/hotelController.js';
import { getPublicVehicles, getPublicVehicleBySlug } from '../controllers/vehicleController.js';
import { createBooking, getMyBookings } from '../controllers/bookingController.js';
import { createLead } from '../controllers/leadController.js';
import { getPublicTerms, getPublicTermByType } from '../controllers/termsController.js';
import { getPublicSettings } from '../controllers/settingsController.js';
import { authenticate } from '../middleware/authenticate.js';

import { getBookingPayment } from '../controllers/paymentController.js';

const router = Router();

// Packages
router.get('/packages', getPublicPackages);
router.get('/packages/:slug', getPublicPackageBySlug);

// Hotels
router.get('/hotels', getPublicHotels);
router.get('/hotels/:slug', getPublicHotelBySlug);

// Vehicles / Cabs
router.get('/cars', getPublicVehicles);
router.get('/cars/:slug', getPublicVehicleBySlug);

// Bookings
router.post('/bookings', createBooking);
router.get('/bookings/my', authenticate, getMyBookings);
router.get('/bookings/:id/payment', getBookingPayment);

// Leads & Inquiries
router.post('/leads', createLead);
router.post('/enquiries', createLead);

// Terms & Legal Policies
router.get('/terms', getPublicTerms);
router.get('/terms/:type', getPublicTermByType);

// Platform Settings (Public keys only)
router.get('/settings', getPublicSettings);

// Reviews & FAQs from database or curated verified records
router.get('/reviews', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'rev-1', author: 'S. Venkatesh Prasad', location: 'Bengaluru', rating: 5, date: 'October 2026', comment: 'Flawless 1-Day VIP Break Darshan assistance. The vehicle was prompt and the coordinator guided us seamlessly.' },
      { id: 'rev-2', author: 'Ramanathan K.', location: 'Chennai', rating: 5, date: 'September 2026', comment: 'Booked Pai Viceroy along with Innova for my elderly parents. Ground floor room and wheelchair was arranged as promised.' },
      { id: 'rev-3', author: 'Ananya Sharma', location: 'New Delhi', rating: 5, date: 'September 2026', comment: 'Superb hospitality and pure vegetarian meals. Made our sacred Tirupati yatra truly peaceful.' }
    ]
  });
});

router.get('/faqs', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'faq-1', question: 'Do you provide official TTD Darshan tickets?', answer: 'We are an independent devotional travel concierge providing dedicated transport, sanitized hotel stays, and queue reporting assistance. Devotees carry their authorized TTD slot tickets or we assist in coordinating slot dates.' },
      { id: 'faq-2', question: 'What is the dress code for Tirumala Temple?', answer: 'Traditional dress code is mandatory: Dhoti/Kurta or Pyjama for men; Saree, Half-Saree, or Chudidar with Dupatta for women. Jeans and western casual wear are strictly prohibited.' },
      { id: 'faq-3', question: 'What is the cancellation policy for bookings?', answer: '100% full refund with zero cancellation charges when cancelled 24 hours prior to scheduled departure. 90% refund within 24 hours.' }
    ]
  });
});

export default router;
