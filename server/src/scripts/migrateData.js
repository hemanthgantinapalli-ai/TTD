import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import Lead from '../models/Lead.js';
import Term from '../models/Term.js';
import Setting from '../models/Setting.js';
import { auditDatabase } from './auditDatabase.js';

export const migrateData = async () => {
  await connectDB();
  console.log('[Migration] Starting MongoDB production data architecture migration...');

  // 1. Migrate / Upsert Packages
  const initialPackages = [
    {
      title: '1-Day Express VIP Break Darshan & Tirumala Yatra',
      slug: '1-day-express-vip-darshan-yatra',
      tagline: 'Complete Tirupati & Tirumala Pilgrimage in 24 Hours with Dedicated Cab',
      shortDescription: 'Ideal for busy professionals desiring expedited darshan with private pickup & return.',
      category: '1-Day Express',
      duration: '1 Day / Same Day Return',
      startingPrice: 2499,
      originalPrice: 3499,
      rating: 4.9,
      reviewCount: 1850,
      featured: true,
      badge: 'Most Popular',
      thumbnail: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Dedicated AC Cab for Tirupati Railway/Airport pickup & Ghat road transit',
        'Step-by-step Darshan Queue guidance by local Pilgrim Coordinator',
        'Visits to Sri Padmavathi Ammavari Temple (Tiruchanoor) & Kapila Theertham',
        'Complimentary Srivari Laddu Prasadam assistance',
        'Kalyanakatta (Tonsure) & Angapradakshinam advisory'
      ],
      inclusions: [
        'Pick up & Drop from Tirupati Railway Station / Hotel / Airport',
        'Dedicated AC Vehicle with Hill-road experienced driver',
        'Tirumala Ghat Toll & Parking charges',
        'Local sightseeing: Tiruchanoor Temple & Kapila Theertham',
        'Trip Assistance on phone and at Alipiri / Hilltop',
        'Complimentary water bottle and temple guide pamphlet'
      ],
      exclusions: [
        'Official TTD Darshan Ticket (Devotees must carry valid TTD ticket or token)',
        'Food & Personal Expenses',
        'Special Seva fees payable directly to TTD'
      ],
      itinerary: [
        { time: '06:00 AM', title: 'Pickup & Freshen Up', description: 'Chauffeur receives you at Tirupati Railway Station / Airport.' },
        { time: '07:30 AM', title: 'Alipiri Toll & Ghat Road Ascent', description: 'Vehicle passes Alipiri security gate and ascends the picturesque 7 hills.' },
        { time: '09:00 AM', title: 'Tirumala Srivari Temple Darshan', description: 'Guided entry at Vaikuntam Queue Complex.' },
        { time: '01:30 PM', title: 'Hilltop Sightseeing & Satvic Lunch', description: 'Visit sacred spots: Papavinasam, Akasa Ganga, Silathoranam natural arch.' },
        { time: '04:30 PM', title: 'Ghat Descent & Padmavathi Ammavari Darshan', description: 'Descend to Tiruchanoor to worship Goddess Sri Padmavathi Devi.' },
        { time: '07:30 PM', title: 'Drop at Railway Station / Hotel', description: 'Conclude your divine pilgrimage with blessings and memories.' }
      ],
      status: 'active'
    },
    {
      title: '2-Day Complete Tirumala, Kanipakam & Sri Kalahasti Yatra',
      slug: '2-day-complete-tirupati-srikalahasti-yatra',
      tagline: 'Holistic Pilgrimage covering Lord Venkateswara, Varasiddhi Vinayaka & Vayu Lingam',
      shortDescription: 'Comprehensive circuit covering Tirumala, Kanipakam Vinayaka, and Rahu Ketu Kshetra Sri Kalahasti with hotel stay.',
      category: '2 Days / 1 Night',
      duration: '2 Days / 1 Night',
      startingPrice: 4999,
      originalPrice: 6500,
      rating: 4.8,
      reviewCount: 940,
      featured: true,
      badge: 'Complete Circuit',
      thumbnail: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      highlights: [
        '1 Night 4-Star Hotel Stay in Tirupati with complimentary breakfast',
        'Private AC Cab for entire 2 days covering 4 sacred temples',
        'Tirumala Venkateswara Swamy Darshan with Laddu assistance',
        'Sri Kalahasteeswara Temple (Rahu-Ketu Dosha Nivarana Kshetra)',
        'Kanipakam Sri Varasiddhi Vinayaka Temple with Swayambhu idol'
      ],
      inclusions: [
        '1 Night Stay in AC Deluxe Room (Double Sharing)',
        'Buffet Vegetarian Breakfast at Hotel',
        'Private AC Sedan / Innova for full 2 days itinerary',
        'All Interstate Tolls, Ghat Toll, Driver Beta & Parking Fees',
        '24/7 Pilgrim Support Helpline'
      ],
      exclusions: [
        'TTD & Sri Kalahasti Pooja special entry tickets',
        'Lunch & Dinner expenses'
      ],
      itinerary: [
        { time: 'Day 1 - Morning', title: 'Arrival in Tirupati & Kanipakam Darshan', description: 'Pickup from station/airport, visit the ancient Swayambhu Varasiddhi Vinayaka Temple in Kanipakam, check-in to hotel.' },
        { time: 'Day 1 - Afternoon', title: 'Sri Kalahasti Temple Visit', description: 'Drive to Sri Kalahasti (36 km), perform Rahu Ketu Pooja / worship Lord Shiva as Vayu Lingam. Evening Aarti.' },
        { time: 'Day 2 - Full Day', title: 'Sacred Tirumala Darshan & Padmavathi Temple', description: 'Ascend Tirumala hill for Srivari Darshan, visit Papavinasam & Akasa Ganga. Descend for Tiruchanoor Ammavari Darshan and departure drop.' }
      ],
      status: 'active'
    },
    {
      title: 'Senior Citizen & Differently Abled Special Care Yatra',
      slug: 'senior-citizen-assisted-darshan-package',
      tagline: 'Unhurried, Wheelchair-friendly, Comfortable Pilgrimage with Elder Care Assistant',
      shortDescription: 'Specially crafted for elders with ground-floor rooms, wheelchair assistance, and slow-paced temple itineraries.',
      category: 'Special Care',
      duration: '2 Days / 1 Night',
      startingPrice: 5800,
      originalPrice: 7200,
      rating: 4.95,
      reviewCount: 680,
      featured: true,
      badge: 'Elder Care',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Specially trained Pilgrim Assistant accompanying elders through queue lines',
        'Ground floor AC room in pure vegetarian hotel with elevator access',
        'Battery car coordination & wheelchair assistance at Tirumala Vaikuntam',
        'Direct vehicle drop closest to Mahadwaram entry point',
        'Extra resting pauses, warm satvic meals, and medication reminders'
      ],
      inclusions: [
        'Dedicated attendant for physical queue assistance and luggage handling',
        'Spacious AC Innova Crysta with low step-in height for comfortable boarding',
        'Wheelchair on standby throughout the tour',
        '1 Night Premium Pure-Veg Hotel Stay with customized soft meals',
        'Tirumala Ghat Toll & Parking'
      ],
      exclusions: ['Medicines & Personal Nurse expenses'],
      status: 'active'
    },
    {
      title: '3-Day Navagraha & South Andhra Divine Odyssey',
      slug: '3-day-navagraha-south-andhra-odyssey',
      tagline: 'Deep Spiritual Immersion covering Tirumala, Kalahasti, Kanipakam & Vellore Golden Temple',
      shortDescription: 'Ultimate 3-day spiritual circuit across Tirumala hills, Sripuram Golden Temple, and ancient Chola shrines.',
      category: '3 Days / 2 Nights',
      duration: '3 Days / 2 Nights',
      startingPrice: 8500,
      originalPrice: 11000,
      rating: 4.85,
      reviewCount: 420,
      featured: false,
      badge: 'Grand Circuit',
      thumbnail: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      highlights: [
        '2 Nights 4-Star Stay in Tirupati with pure vegetarian dining',
        'Full Day Tirumala Darshan with hill sightseeing',
        'Sripuram Sri Lakshmi Narayani Golden Temple (Vellore)',
        'Sri Kalahasti Vayu Lingam & Kanipakam Ganesha Darshan',
        'Dedicated luxury fleet vehicle with professional interstate chauffeur'
      ],
      inclusions: [
        '2 Nights 4-Star Accommodation (Double Sharing)',
        'Daily Buffet Satvic Breakfast',
        'Dedicated AC Vehicle with Interstate Permit & Tolls',
        'Local Pilgrim Coordinator in Tirupati'
      ],
      exclusions: ['Special entry darshan tickets', 'Personal pooja dakshina'],
      status: 'active'
    }
  ];

  for (const pkg of initialPackages) {
    await Package.findOneAndUpdate(
      { slug: pkg.slug },
      { $set: pkg },
      { upsert: true, new: true }
    );
  }
  console.log(`[Migration] Packages migrated: ${initialPackages.length}`);

  // 2. Migrate / Upsert Hotels
  const initialHotels = [
    {
      slug: 'fortune-select-grand-ridge',
      name: 'Fortune Select Grand Ridge',
      tagline: 'Member ITC Hotel Group - Luxury near Shilparamam',
      category: '5-Star Luxury',
      starRating: 5,
      reviewRating: 4.8,
      reviewCount: 1420,
      location: 'Shilparamam, Tirupati',
      address: 'Near Shilparamam, Tiruchanoor Road, Tirupati - 517501',
      proximity: { railwayStation: '3.5 km', airport: '12 km', alipiriTollGate: '7.5 km', busStand: '2.8 km' },
      pricePerNight: 4800,
      originalPrice: 6200,
      vegOnly: false,
      hasVegKitchen: true,
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Offering sweeping views of the sacred Tirumala Hills, Fortune Select Grand Ridge is an exceptional upscale stay offering pure vegetarian dining options, express check-in for pilgrims, and complimentary morning temple shuttle services.',
      amenities: ['Free High-Speed Wi-Fi', 'Pure Veg Multi-Cuisine Restaurant (Rainbow)', '24-Hour Hot Water', 'Temple Shuttle Assistance', 'Central AC with Climate Control'],
      rooms: [
        { id: 'r-101', name: 'Deluxe AC Room', bedType: '1 King Bed', maxGuests: 3, price: 4800, originalPrice: 5800, size: '320 sq.ft', features: ['Hill View', 'Complimentary Breakfast', '24h Hot Water'] },
        { id: 'r-102', name: 'Executive Hill-View Room', bedType: '1 King Bed + Extra Mattress', maxGuests: 3, price: 6200, originalPrice: 7500, size: '410 sq.ft', features: ['Panoramic Tirumala Hill View', 'Buffet Breakfast'] }
      ],
      status: 'active'
    },
    {
      slug: 'marasa-sarovar-premiere',
      name: 'Marasa Sarovar Premiere',
      tagline: "World's First Dasavatara Themed Spiritual Hotel",
      category: '5-Star Themed Resort',
      starRating: 5,
      reviewRating: 4.9,
      reviewCount: 2180,
      location: 'Upadhyaya Nagar, Tirupati',
      address: 'Karakambadi Road, Upadhyaya Nagar, Tirupati - 517507',
      proximity: { railwayStation: '4.2 km', airport: '14 km', alipiriTollGate: '6.0 km', busStand: '3.8 km' },
      pricePerNight: 5200,
      originalPrice: 6800,
      vegOnly: false,
      hasVegKitchen: true,
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'],
      description: 'Designed around the 10 avatars of Lord Vishnu, Marasa Sarovar offers a sublime, peaceful spiritual atmosphere with lotus water bodies, tranquil garden walkways, pure sattvic food options, and personalized temple darshan support.',
      amenities: ['Dasavatara Architecture & Water Gardens', 'Sattvik & Multi-Cuisine Restaurants', 'Tirumala Ghat Road Fast Pass Guidance Desk', 'Ayurvedic Wellness Sanctuary'],
      rooms: [
        { id: 'r-201', name: 'Matsya Premium Room', bedType: '1 King Bed', maxGuests: 3, price: 5200, originalPrice: 6500, size: '350 sq.ft', features: ['Water Body View', 'Sattvic Breakfast Included'] }
      ],
      status: 'active'
    },
    {
      slug: 'pai-viceroy-tirupati',
      name: 'Pai Viceroy Hotel',
      tagline: '100% Pure Vegetarian Pilgrim Hotel near Alipiri',
      category: '4-Star Pilgrim Hotel',
      starRating: 4,
      reviewRating: 4.7,
      reviewCount: 980,
      location: 'Near Alipiri Gate, Tirupati',
      address: 'T.P. Area, Near Alipiri Toll Gate, Tirupati - 517501',
      proximity: { railwayStation: '1.8 km', airport: '15 km', alipiriTollGate: '1.2 km', busStand: '1.5 km' },
      pricePerNight: 3200,
      originalPrice: 4200,
      vegOnly: true,
      hasVegKitchen: true,
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80'],
      description: 'Closest 4-star hotel to Alipiri (foot of Tirumala Hills). Famous for its strictly vegetarian "Plantain Leaf" South Indian restaurant, quick checkout for early morning 3 AM Suprabhata Seva devotees, and pristine rooms.',
      amenities: ['100% Pure Vegetarian (Strict)', 'Closest to Alipiri Foothill Steps', 'Early Morning 3 AM Wake-up & Taxi Call', 'Clean & Sanitized Bathrooms'],
      rooms: [
        { id: 'r-301', name: 'Superior Twin Room', bedType: '2 Single Beds', maxGuests: 2, price: 3200, originalPrice: 4000, size: '280 sq.ft', features: ['City View', 'Pure Veg Breakfast', '24h Hot Geyser'] }
      ],
      status: 'active'
    },
    {
      slug: 'hotel-bliss-tirupati',
      name: 'Hotel Bliss Tirupati',
      tagline: 'Trusted Pilgrim Hospitality near Central Bus Stand',
      category: '4-Star Hotel',
      starRating: 4,
      reviewRating: 4.6,
      reviewCount: 1120,
      location: 'Near Central Bus Station, Tirupati',
      address: 'Near Ramanuja Circle, Renigunta Road, Tirupati - 517501',
      proximity: { railwayStation: '1.2 km', airport: '13 km', alipiriTollGate: '4.5 km', busStand: '0.4 km' },
      pricePerNight: 2800,
      originalPrice: 3800,
      vegOnly: false,
      hasVegKitchen: true,
      featured: false,
      thumbnail: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'],
      description: 'One of the most reputed and enduring hospitality landmarks in Tirupati, offering dedicated 24-hour check-in, pure vegetarian South Indian dining at "Navrattan", and quick access to all major temple transport points.',
      amenities: ['24-Hour Check-in / Checkout Assistance', 'Pure Vegetarian Restaurant', 'Doctor on Call for Senior Pilgrims', 'Free Wi-Fi'],
      rooms: [
        { id: 'r-401', name: 'Executive AC Room', bedType: '1 Double Bed', maxGuests: 2, price: 2800, originalPrice: 3500, size: '260 sq.ft', features: ['City View', 'Complimentary Breakfast', 'Geyser'] }
      ],
      status: 'active'
    }
  ];

  for (const hotel of initialHotels) {
    await Hotel.findOneAndUpdate(
      { slug: hotel.slug },
      { $set: hotel },
      { upsert: true, new: true }
    );
  }
  console.log(`[Migration] Hotels migrated: ${initialHotels.length}`);

  // 3. Migrate / Upsert Vehicles
  const initialVehicles = [
    {
      name: 'Toyota Innova Crysta (Luxury 7-Seater)',
      slug: 'toyota-innova-crysta-7-seater',
      category: 'Premium MPV',
      type: 'Luxury Cab',
      model: 'Innova Crysta 2.4 VX',
      registrationNumber: 'AP 39 TK 7789',
      capacity: '6 to 7 Devotees',
      luggage: '4 Large Bags + 2 Small Bags',
      fuelType: 'Diesel',
      ac: true,
      pricePerDay: 3600,
      perKmRate: 16,
      minKmPerDay: 250,
      airportPickupChennai: 5200,
      airportPickupBangalore: 6800,
      airportPickupTirupati: 900,
      rating: 4.9,
      reviewCount: 1140,
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      description: 'The undisputed gold standard for family pilgrimage travel. Supreme comfort on the winding 7 Tirumala ghat roads, captain seating, dual AC, and driven by experienced hill-certified devotional drivers.',
      features: ['Ghat Road Certified Experienced Driver', 'Dual Zone High Efficiency Air Conditioning', 'Reclining Captain Bucket Seats', 'Bottled Water & Devotional Audio Playlist'],
      driverDetails: { name: 'Ramesh Naidu', phone: '+91 98490 12345', languages: ['Telugu', 'Tamil', 'Kannada', 'Hindi', 'English'], experienceYears: '12+ Years Tirumala Ghat experience' },
      status: 'active'
    },
    {
      name: 'Maruti Suzuki Dzire AC Sedan',
      slug: 'maruti-suzuki-dzire-sedan',
      category: 'Compact Sedan',
      type: 'Sedan Cab',
      model: 'Dzire VXi',
      registrationNumber: 'AP 39 TC 4421',
      capacity: '4 Devotees',
      luggage: '2 Large Bags + Handbags',
      fuelType: 'Petrol / Hybrid',
      ac: true,
      pricePerDay: 2200,
      perKmRate: 12,
      minKmPerDay: 250,
      airportPickupChennai: 3400,
      airportPickupBangalore: 4800,
      airportPickupTirupati: 600,
      rating: 4.7,
      reviewCount: 620,
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      description: 'Perfect for couples and small nuclear families visiting Tirupati. Economical, neat, and highly agile for city temple visits and Tirumala hilltop.',
      features: ['Reliable AC & Smooth Suspension', 'Local Driver with Temple Route Guidance', 'Clean & Odour-free Interiors'],
      driverDetails: { name: 'K. Srinivas', phone: '+91 94440 55443', languages: ['Telugu', 'Tamil', 'Hindi'], experienceYears: '8+ Years' },
      status: 'active'
    },
    {
      name: 'Force Tempo Traveller (12 & 14 Seater)',
      slug: 'tempo-traveller-12-seater',
      category: 'Group Mini-Bus',
      type: 'Group Traveller',
      model: 'Tempo Traveller 3350',
      registrationNumber: 'AP 39 TT 9012',
      capacity: '12 to 14 Devotees',
      luggage: '12 Bags + Overhead Rack',
      fuelType: 'Diesel',
      ac: true,
      pricePerDay: 5800,
      perKmRate: 24,
      minKmPerDay: 300,
      airportPickupChennai: 7800,
      airportPickupBangalore: 9800,
      airportPickupTirupati: 1800,
      rating: 4.8,
      reviewCount: 430,
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      description: 'Ideal choice for extended family groups, senior citizen sanghams, and Bhajan mandalis. Features high roof ceiling, pushback seats, individual AC vents, and high-power engine.',
      features: ['Pushback Luxury Reclining Seats', 'Senior Citizen Step-Stool for Easy Boarding', 'Generous Luggage Compartment'],
      driverDetails: { name: 'M. Govindaraj', phone: '+91 99001 98765', languages: ['Telugu', 'Tamil', 'Kannada', 'Hindi'], experienceYears: '15+ Years Group Tour Specialist' },
      status: 'active'
    },
    {
      name: 'Toyota Fortuner 4x4 VIP Flagship',
      slug: 'toyota-fortuner-4x4-vip',
      category: 'VIP Luxury SUV',
      type: 'VIP SUV',
      model: 'Fortuner 4x4 AT',
      registrationNumber: 'AP 39 TF 0001',
      capacity: '6 Devotees',
      luggage: '4 Large Bags',
      fuelType: 'Diesel',
      ac: true,
      pricePerDay: 6500,
      perKmRate: 28,
      minKmPerDay: 250,
      airportPickupChennai: 8500,
      airportPickupBangalore: 11000,
      airportPickupTirupati: 1800,
      rating: 4.9,
      reviewCount: 290,
      featured: false,
      thumbnail: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      description: 'Executive VIP transport suited for dignitaries, overseas devotees, and corporate yatras desiring top-tier security and chauffeur-driven protocol handling.',
      features: ['Uniformed Executive Chauffeur', 'Plush Leather Interior', 'Fast-track Toll & VIP Darshan Bay Drop'],
      driverDetails: { name: 'B. Mohan', phone: '+91 97110 33221', languages: ['English', 'Telugu', 'Hindi', 'Tamil'], experienceYears: '10+ Years VIP Chauffeur' },
      status: 'active'
    }
  ];

  for (const car of initialVehicles) {
    await Vehicle.findOneAndUpdate(
      { slug: car.slug },
      { $set: car },
      { upsert: true, new: true }
    );
  }
  console.log(`[Migration] Vehicles migrated: ${initialVehicles.length}`);

  // 4. Migrate / Upsert Bookings
  const initialBookings = [
    {
      bookingId: 'bk_1727530000001',
      pnr: 'TTY-2026-83412',
      type: 'package',
      itemName: '1-Day Express VIP Break Darshan & Tirumala Yatra',
      amount: 4998,
      travelDate: new Date('2026-10-05'),
      travellers: 2,
      customerDetails: { name: 'Venkatesh Prasad', phone: '+91 98765 43210', email: 'devotee@ttdyatra.com', city: 'Bengaluru' },
      leadPilgrim: { name: 'Venkatesh Prasad', phone: '+91 98765 43210', email: 'devotee@ttdyatra.com', city: 'Bengaluru' },
      paymentMethod: 'UPI (PhonePe QR)',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      notes: 'Morning 5:30 AM pickup from Tirupati Railway Station.'
    },
    {
      bookingId: 'bk_1727530000002',
      pnr: 'TTY-2026-62191',
      type: 'hotel',
      itemName: 'Pai Viceroy Hotel - Superior Twin Room',
      amount: 3200,
      travelDate: new Date('2026-09-20'),
      travellers: 2,
      customerDetails: { name: 'Ramanathan K.', phone: '+91 94440 12345', email: 'ramanathan@gmail.com', city: 'Chennai' },
      leadPilgrim: { name: 'Ramanathan K.', phone: '+91 94440 12345', email: 'ramanathan@gmail.com', city: 'Chennai' },
      paymentMethod: 'Credit Card (HDFC)',
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      notes: 'Elderly pilgrims. Ground floor room allocated.'
    },
    {
      bookingId: 'bk_1727530000003',
      pnr: 'TTY-2026-91483',
      type: 'car',
      itemName: 'Toyota Innova Crysta (Luxury 7-Seater)',
      amount: 3600,
      travelDate: new Date('2026-10-02'),
      travellers: 5,
      customerDetails: { name: 'Sunil Reddy', phone: '+91 98490 55678', email: 'sunil.reddy@yahoo.com', city: 'Hyderabad' },
      leadPilgrim: { name: 'Sunil Reddy', phone: '+91 98490 55678', email: 'sunil.reddy@yahoo.com', city: 'Hyderabad' },
      paymentMethod: 'NetBanking (SBI)',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      notes: 'Assigned Driver: Ramesh (12y Ghat experience).'
    },
    {
      bookingId: 'bk_1727530000004',
      pnr: 'TTY-2026-44120',
      type: 'package',
      itemName: 'Senior Citizen & Differently Abled Special Care Yatra',
      amount: 11600,
      travelDate: new Date('2026-10-12'),
      travellers: 2,
      customerDetails: { name: 'Srinivasa Murthy', phone: '+91 97312 88990', email: 'murthy.s@gmail.com', city: 'Mysuru' },
      leadPilgrim: { name: 'Srinivasa Murthy', phone: '+91 97312 88990', email: 'murthy.s@gmail.com', city: 'Mysuru' },
      paymentMethod: 'Pending Gateway Confirmation',
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      notes: 'Needs wheelchair assistance at Vaikuntam queue.'
    },
    {
      bookingId: 'bk_1727530000005',
      pnr: 'TTY-2026-18902',
      type: 'hotel',
      itemName: 'Fortune Select Grand Ridge - Deluxe AC Room',
      amount: 4800,
      travelDate: new Date('2026-09-15'),
      travellers: 3,
      customerDetails: { name: 'Ananya Sharma', phone: '+91 98112 34567', email: 'ananya.sharma@deloitte.com', city: 'New Delhi' },
      leadPilgrim: { name: 'Ananya Sharma', phone: '+91 98112 34567', email: 'ananya.sharma@deloitte.com', city: 'New Delhi' },
      paymentMethod: 'UPI (Google Pay)',
      paymentStatus: 'refunded',
      bookingStatus: 'cancelled',
      notes: 'Flight cancelled. 100% refund processed within 24h window.'
    },
    {
      bookingId: 'bk_1727530000006',
      pnr: 'TTY-2026-77341',
      type: 'package',
      itemName: '2-Day Complete Tirumala, Kanipakam & Sri Kalahasti Yatra',
      amount: 9998,
      travelDate: new Date('2026-10-18'),
      travellers: 2,
      customerDetails: { name: 'Dr. Arvind Kumar', phone: '+91 98200 98765', email: 'arvind.kumar@apollo.org', city: 'Mumbai' },
      leadPilgrim: { name: 'Dr. Arvind Kumar', phone: '+91 98200 98765', email: 'arvind.kumar@apollo.org', city: 'Mumbai' },
      paymentMethod: 'Credit Card (Amex)',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      notes: 'Temple priest darshan coordination requested.'
    }
  ];

  for (const bkg of initialBookings) {
    await Booking.findOneAndUpdate(
      { bookingId: bkg.bookingId },
      { $set: bkg },
      { upsert: true, new: true }
    );
  }
  console.log(`[Migration] Bookings migrated: ${initialBookings.length}`);

  // 5. Migrate / Upsert Leads (Enquiries)
  const initialLeads = [
    {
      name: 'Dr. Madhavan Nair',
      phone: '+91 98450 11223',
      email: 'madhavan.nair@apollo.org',
      city: 'Kochi',
      serviceType: 'Senior Citizen Package + Wheelchair',
      travellersCount: 4,
      preferredDate: '2026-10-25',
      message: 'Bringing my 84-year old mother for her first Tirumala darshan. Require continuous helper and wheelchair guidance.',
      status: 'new'
    },
    {
      name: 'Lakshmi Narayana',
      phone: '+91 94401 98765',
      email: 'lakshmi.narayana@tcs.com',
      city: 'Hyderabad',
      serviceType: 'VIP Break Darshan Guidance & 2-Day Innova',
      travellersCount: 6,
      preferredDate: '2026-11-04',
      message: 'Need 2-day itinerary covering Tirumala Swamy and Sri Kalahasti Rahu Ketu Pooja. Please share custom quote.',
      status: 'contacted'
    },
    {
      name: 'Gowtham Kumar',
      phone: '+91 98800 55443',
      email: 'gowtham.k@gmail.com',
      city: 'Chennai',
      serviceType: '1-Day Express Package',
      travellersCount: 3,
      preferredDate: '2026-10-08',
      message: 'Arriving at Renigunta airport at 7:30 AM. Need cab pickup and same-day return drop.',
      status: 'converted'
    }
  ];

  for (const lead of initialLeads) {
    await Lead.findOneAndUpdate(
      { email: lead.email, phone: lead.phone },
      { $set: lead },
      { upsert: true, new: true }
    );
  }
  console.log(`[Migration] Leads migrated: ${initialLeads.length}`);

  // 6. Migrate / Upsert Terms & Policies
  const initialTerms = [
    {
      key: 'termsOfService',
      title: 'Terms of Service',
      content: `1. Acceptance of Terms\nBy accessing or using the TTD Yatra platform, you agree to be bound by these Terms of Service.\n\n2. Scope of Services\nTTDYATRA provides pilgrim travel assistance, hill-certified cab rentals, pure veg hotel accommodations, and darshan reporting advisory. We do not sell official TTD tickets.\n\n3. Sacred Temple Code of Conduct\nDevotees must strictly adhere to traditional temple dress codes (Dhoti/Kurta for men; Saree/Chudidar for women).\n\n4. Limitation of Liability\nTTDYATRA is an independent devotional travel concierge and is not liable for sudden TTD queue timing changes or temple protocol halts.`,
      status: 'published',
      version: '1.0'
    },
    {
      key: 'privacyPolicy',
      title: 'Privacy Policy',
      content: `1. Information We Collect\nWe collect personal details necessary to deliver travel services, including names, contact numbers, email addresses, and ID proofs.\n\n2. No Selling of Pilgrim Data\nWe uphold sacred privacy standards. Devotee details are never sold or shared with third-party marketers.\n\n3. Payment Security\nAll transactions are processed through RBI-authorized, PCI-DSS compliant gateways with 256-bit SSL encryption.`,
      status: 'published',
      version: '1.0'
    },
    {
      key: 'refundPolicy',
      title: 'Cancellation & Refund Policy',
      content: `1. Free Cancellation (24h)\nDevotees may cancel hotel or vehicle reservations up to 24 hours prior to scheduled pickup for a 100% full refund.\n\n2. Cancellation (<24h)\nA nominal 10% administrative fee is retained, with 90% refunded.\n\n3. Train / Flight Delay Protection\nComplimentary rescheduling within 90 days or an 85% immediate refund upon verification.`,
      status: 'published',
      version: '1.0'
    },
    {
      key: 'ghatRoadRules',
      title: 'Tirumala Ghat Road Safety Rules',
      content: `• Alipiri Toll Gate is open from 03:00 AM to 12:00 Midnight.\n• Minimum transit time limit of 28 minutes on Up-ghat road and 40 minutes on Down-ghat road must be strictly observed.\n• Carrying alcohol, tobacco, non-veg, or plastics onto the sacred hills is strictly forbidden by law.`,
      status: 'published',
      version: '1.0'
    },
    {
      key: 'disclaimer',
      title: 'Official Disclaimer',
      content: 'TTDYATRA is an independent devotional travel facilitator and concierge. We are NOT affiliated with, authorized by, or an agent of Tirumala Tirupati Devasthanams (TTD). All official darshan tokens and pooja sevas are governed exclusively by TTD rules.',
      status: 'published',
      version: '1.0'
    },
    {
      key: 'announcementBanner',
      title: 'Announcement Banner',
      content: {
        enabled: true,
        text: '🕉️ TTD Special Entry Darshan (₹300) Quota releases on 24th Oct 10:00 AM IST. Pre-book your sanitized cab & stay with zero cancellation charges!',
        badge: 'Important Update'
      },
      status: 'published',
      version: '1.0'
    }
  ];

  for (const term of initialTerms) {
    await Term.findOneAndUpdate(
      { key: term.key },
      { $set: term },
      { upsert: true, new: true }
    );
  }
  console.log(`[Migration] Terms migrated: ${initialTerms.length}`);

  // 7. Migrate / Upsert Platform Settings
  const initialSettings = [
    { key: 'platformName', value: 'TTD Yatra Official Platform', category: 'general', isPublic: true, description: 'Brand site title' },
    { key: 'helplinePhone', value: '+91 91483 91081', category: 'contact', isPublic: true, description: '24/7 Pilgrim Support Line' },
    { key: 'whatsappNumber', value: '+91 91483 91081', category: 'contact', isPublic: true, description: 'WhatsApp Pilgrim Helpdesk' },
    { key: 'supportEmail', value: 'darshan@ttdyatra.com', category: 'contact', isPublic: true, description: 'Devotee Support Email' },
    { key: 'officeAddress', value: '19-3-2R, Renigunta Road, Korlagunta, Tirupati - 517501', category: 'contact', isPublic: true, description: 'Head Office Address' },
    { key: 'paymentGatewayLive', value: true, category: 'payment', isPublic: true, description: 'Live payment processing status' },
    { key: 'enableSmsAlerts', value: true, category: 'notifications', isPublic: true, description: 'SMS notification service' },
    { key: 'enableWhatsAppAlerts', value: true, category: 'notifications', isPublic: true, description: 'WhatsApp notification service' },
    { key: 'maxDailyBookingsLimit', value: 150, category: 'bookings', isPublic: false, description: 'Maximum slots per day' }
  ];

  for (const s of initialSettings) {
    await Setting.findOneAndUpdate(
      { key: s.key },
      { $set: s },
      { upsert: true, new: true }
    );
  }
  console.log(`[Migration] Settings migrated: ${initialSettings.length}`);

  console.log('\n[Migration] Migration successfully finished! Running audit verification...\n');
  return await auditDatabase();
};

if (process.argv[1]?.endsWith('migrateData.js')) {
  migrateData().then(() => mongoose.disconnect()).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
