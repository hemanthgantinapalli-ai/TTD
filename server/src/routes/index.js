import express from 'express';
import { getHealth } from '../controllers/healthController.js';

const router = express.Router();

// ─── Full Rich Dataset ────────────────────────────────────────────────────────

let HOTELS = [
  {
    id: 'hotel-1',
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
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Offering sweeping views of the sacred Tirumala Hills, Fortune Select Grand Ridge is an exceptional upscale stay offering pure vegetarian dining options, express check-in for pilgrims, and complimentary morning temple shuttle services.',
    amenities: ['Free High-Speed Wi-Fi', 'Pure Veg Multi-Cuisine Restaurant (Rainbow)', '24-Hour Hot Water', 'Temple Shuttle Assistance', 'Swimming Pool & Wellness Spa', 'Pilgrim Travel Desk & Darshan Coordination', 'Central AC with Climate Control', 'Free Valet Parking'],
    rooms: [
      { id: 'r-101', name: 'Deluxe AC Room', bedType: '1 King Bed or 2 Twin Beds', maxGuests: 3, price: 4800, originalPrice: 5800, size: '320 sq.ft', features: ['Hill View', 'Complimentary Breakfast', 'Free Cancellation up to 24h before', '24h Hot Water Shower'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80' },
      { id: 'r-102', name: 'Executive Hill-View Room', bedType: '1 King Bed + Extra Mattress on request', maxGuests: 3, price: 6200, originalPrice: 7500, size: '410 sq.ft', features: ['Panoramic Tirumala Hill View', 'Buffet Breakfast & High Tea', 'Priority Temple Shuttle', 'Mini Bar & Tea Maker'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' },
      { id: 'r-103', name: 'Grand Family Suite (4 Pax)', bedType: '2 King Beds + Living Area', maxGuests: 5, price: 9800, originalPrice: 12000, size: '650 sq.ft', features: ['Separate Living Room', '2 En-suite Bathrooms', 'Complimentary Prasadam Basket', 'Late Checkout Priority'], image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    id: 'hotel-2',
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
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'],
    description: 'Designed around the 10 avatars of Lord Vishnu, Marasa Sarovar offers a sublime, peaceful spiritual atmosphere with lotus water bodies, tranquil garden walkways, pure sattvic food options, and personalized temple darshan support.',
    amenities: ['Dasavatara Architecture & Water Gardens', 'Sattvik & Multi-Cuisine Restaurants', 'Tirumala Ghat Road Fast Pass Guidance Desk', 'Ayurvedic Wellness Sanctuary', 'Children Play Zone & Prayer Hall', '24/7 Room Service & Concierge'],
    rooms: [
      { id: 'r-201', name: 'Matsya Premium Room', bedType: '1 King Bed', maxGuests: 3, price: 5200, originalPrice: 6500, size: '350 sq.ft', features: ['Water Body View', 'Organic Toiletries', 'Sattvic Breakfast Included', 'High-speed Wi-Fi'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80' },
      { id: 'r-202', name: 'Kurma Deluxe Family Suite', bedType: '2 Queen Beds', maxGuests: 4, price: 8400, originalPrice: 10500, size: '580 sq.ft', features: ['Garden View Patio', 'Complimentary Laddu Prasadam Kit', '2 Attached Bathrooms', '24h In-room Dining'], image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    id: 'hotel-3',
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
    images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'],
    description: 'Closest 4-star hotel to Alipiri (foot of Tirumala Hills). Famous for its strictly vegetarian "Plantain Leaf" South Indian restaurant, quick checkout for early morning 3 AM Suprabhata Seva devotees, and pristine rooms.',
    amenities: ['100% Pure Vegetarian (Strict)', 'Closest to Alipiri Foothill Steps', 'Early Morning 3 AM Wake-up & Taxi Call', 'Complimentary South Indian Filter Coffee', 'Driver Accommodation Facilities', 'Clean & Sanitized Bathrooms'],
    rooms: [
      { id: 'r-301', name: 'Superior Twin Room', bedType: '2 Single Beds', maxGuests: 2, price: 3200, originalPrice: 4000, size: '280 sq.ft', features: ['City View', 'Delicious Pure Veg Breakfast', '24h Hot Geyser', 'Mineral Water'], image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80' },
      { id: 'r-302', name: 'Pilgrim Family Quad Room', bedType: '2 Double Beds', maxGuests: 4, price: 5400, originalPrice: 6500, size: '450 sq.ft', features: ['Ideal for Families & Elders', 'Plantain Leaf Breakfast Included', 'Extra Wardrobe & Luggage Space'], image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    id: 'hotel-4',
    slug: 'hotel-bliss-tirupati',
    name: 'Hotel Bliss Tirupati',
    tagline: 'Renowned Hospitality in the Heart of Tirupati City',
    category: '4-Star Premium',
    starRating: 4,
    reviewRating: 4.6,
    reviewCount: 1650,
    location: 'Ramanuja Circle, Tirupati',
    address: 'Near Ramanuja Circle, Renigunta Road, Tirupati - 517501',
    proximity: { railwayStation: '1.2 km', airport: '11 km', alipiriTollGate: '4.5 km', busStand: '0.8 km' },
    pricePerNight: 2800,
    originalPrice: 3600,
    vegOnly: false,
    hasVegKitchen: true,
    featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=80'],
    description: 'Located right next to the central bus terminal and railway station, Hotel Bliss is legendary in Tirupati for its warm hospitality, pure South Indian filter coffee, and seamless connectivity to temple transport.',
    amenities: ['Walking distance from Central Bus Stand', 'Pure Veg Restaurant "Navrattan"', '24-Hour Room Service', 'Free Wi-Fi & AC', 'Doctor on Call'],
    rooms: [{ id: 'r-401', name: 'Executive AC Room', bedType: '1 King Bed', maxGuests: 2, price: 2800, originalPrice: 3500, size: '260 sq.ft', features: ['Breakfast Included', 'AC & Cable TV', 'Hot Water', 'Coffee Maker'], image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=600&q=80' }],
  },
  {
    id: 'hotel-5',
    slug: 'minerva-grand-tirupati',
    name: 'Minerva Grand Tirupati',
    tagline: 'Modern Comfort with Famous Minerva Coffee Shop',
    category: '4-Star Business & Pilgrim',
    starRating: 4,
    reviewRating: 4.7,
    reviewCount: 1120,
    location: 'Old Madras Road, Tirupati',
    address: 'Near RTC Bus Complex, Renigunta Road, Tirupati - 517501',
    proximity: { railwayStation: '1.5 km', airport: '12 km', alipiriTollGate: '5.0 km', busStand: '0.6 km' },
    pricePerNight: 3600,
    originalPrice: 4500,
    vegOnly: false,
    hasVegKitchen: true,
    featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'],
    description: 'Renowned for its iconic South Indian delicacies, dosas and filter coffee at Minerva Coffee Shop. Offers soundproof rooms, fast Wi-Fi, and courteous staff catering to pilgrims and families.',
    amenities: ['Famous Minerva Pure Veg Coffee Shop', 'Gym & Business Center', 'Express Checkout for Early Darshan', 'Complimentary Bottled Water'],
    rooms: [{ id: 'r-501', name: 'Grand Room', bedType: '1 Queen Bed', maxGuests: 2, price: 3600, originalPrice: 4500, size: '300 sq.ft', features: ['Complimentary Buffet Breakfast', 'Work Desk', 'Tea/Coffee Kit', 'Free Wi-Fi'], image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80' }],
  },
  {
    id: 'hotel-6',
    slug: 'sv-rest-house-tirumala',
    name: 'Srivari Pilgrim Cottages & Suites',
    tagline: 'Comfortable hill stays with Darshan corridor access',
    category: 'Heritage Pilgrim Stay',
    starRating: 3,
    reviewRating: 4.5,
    reviewCount: 3400,
    location: 'Ring Road, Tirumala Hills',
    address: 'Near GNC Bus Stand, Tirumala - 517504',
    proximity: { railwayStation: '22 km (at Tirupati)', airport: '38 km', alipiriTollGate: '18 km (downhill)', busStand: '0.4 km' },
    pricePerNight: 1800,
    originalPrice: 2400,
    vegOnly: true,
    hasVegKitchen: true,
    featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'],
    description: 'Located atop sacred Tirumala hill. Clean, serene atmosphere with morning Suprabhatham audio broadcast, walking distance to Vaikuntam Queue Complex and Pushkarini pond.',
    amenities: ['Located directly on Tirumala Hill', 'Walking Distance to Srivari Temple & Pushkarini', '24-Hour Running Hot Water', 'Free Locker Facility for Valuables', '100% Pure Satvic Atmosphere'],
    rooms: [{ id: 'r-601', name: 'Hilltop Cottage Suite', bedType: '2 Double Beds', maxGuests: 4, price: 1800, originalPrice: 2400, size: '380 sq.ft', features: ['Quiet Mountain Air', 'Direct Pushkarini Path Access', 'Geyser & Purified Water'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80' }],
  },
];

let CARS = [
  {
    id: 'car-1',
    slug: 'toyota-innova-crysta',
    name: 'Toyota Innova Crysta (Luxury 7-Seater)',
    category: 'Premium SUV / MUV',
    capacity: '6+1 Devotees',
    luggage: '4 Large Bags',
    fuelType: 'Diesel',
    ac: true,
    pricePerDay: 3600,
    perKmRate: 16,
    minKmPerDay: 250,
    airportPickupChennai: 4500,
    airportPickupBangalore: 6200,
    airportPickupTirupati: 900,
    rating: 4.9,
    reviewCount: 840,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: 'The undisputed gold standard for family pilgrimage travel. Supreme comfort on the winding 7 Tirumala ghat roads, captain seating, dual AC, and driven by experienced hill-certified devotional drivers.',
    features: ['Ghat Road Certified Experienced Driver', 'Dual Zone High Efficiency Air Conditioning', 'Reclining Captain Bucket Seats', 'Bottled Water & Devotional Audio Playlist', 'Tirumala Ghat Toll & Parking Included in Packages', 'Sanitized Vehicle with First Aid Kit'],
    driverDetails: { languages: ['Telugu', 'Tamil', 'Kannada', 'Hindi', 'English'], experienceYears: '12+ Years Tirumala Ghat experience' },
  },
  {
    id: 'car-2',
    slug: 'maruti-suzuki-dzire-sedan',
    name: 'Maruti Suzuki Dzire AC Sedan',
    category: 'Compact Sedan',
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
    description: 'Perfect for couples and small nuclear families visiting Tirupati. Economical, neat, and highly agile for city temple visits (Padmavathi Temple, Kapila Theertham, Govindaraja Swamy Temple) and Tirumala hilltop.',
    features: ['Reliable AC & Smooth Suspension', 'Local Driver with Temple Route Guidance', 'Luggage Boot Space for Prasadam & Bags', 'Clean & Odour-free Interiors'],
    driverDetails: { languages: ['Telugu', 'Tamil', 'Hindi'], experienceYears: '8+ Years' },
  },
  {
    id: 'car-3',
    slug: 'tempo-traveller-12-seater',
    name: 'Force Tempo Traveller (12 & 14 Seater)',
    category: 'Group Mini-Bus',
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
    description: 'Ideal choice for extended family groups, senior citizen sanghams, and Bhajan mandalis. Features high roof ceiling, pushback seats, individual AC vents, and high-power engine for effortless ghat climbs.',
    features: ['Pushback Luxury Reclining Seats', 'High-Power Sound System with Annamayya Keerthanas', 'Senior Citizen Step-Stool for Easy Boarding', 'Generous Luggage Compartment', 'Dedicated Driver & Trip Coordinator'],
    driverDetails: { languages: ['Telugu', 'Tamil', 'Kannada', 'Hindi', 'English'], experienceYears: '15+ Years Group Tour Specialist' },
  },
  {
    id: 'car-4',
    slug: 'toyota-fortuner-4x4-vip',
    name: 'Toyota Fortuner 4x4 VIP Flagship',
    category: 'VIP Luxury SUV',
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
    description: 'Executive VIP transport suited for dignitaries, overseas devotees, and corporate yatras desiring top-tier security, supreme road presence, and chauffeur-driven protocol handling.',
    features: ['Uniformed Executive Chauffeur', 'Plush Leather Interior & Quiet Cabin', 'Fast-track Toll & VIP Darshan Bay Drop', 'Mineral Water, Wet Wipes & Refreshments'],
    driverDetails: { languages: ['English', 'Telugu', 'Hindi', 'Tamil'], experienceYears: '10+ Years VIP Chauffeur' },
  },
];

let PACKAGES = [
  {
    id: 'pkg-1',
    slug: '1-day-express-vip-darshan-yatra',
    title: '1-Day Express VIP Break Darshan & Tirumala Yatra',
    tagline: 'Complete Tirupati & Tirumala Pilgrimage in 24 Hours with Dedicated Cab',
    category: '1-Day Express',
    duration: '1 Day / Same Day Return',
    startingPrice: 2499,
    originalPrice: 3499,
    rating: 4.9,
    reviewCount: 1850,
    featured: true,
    badge: 'Most Popular',
    thumbnail: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    highlights: ['Dedicated AC Cab for Tirupati Railway/Airport pickup & Ghat road transit', 'Step-by-step Darshan Queue guidance by local Pilgrim Coordinator', 'Visits to Sri Padmavathi Ammavari Temple (Tiruchanoor) & Kapila Theertham', 'Complimentary Srivari Laddu Prasadam assistance', 'Kalyanakatta (Tonsure) & Angapradakshinam advisory'],
    inclusions: ['Pick up & Drop from Tirupati Railway Station / Hotel / Airport', 'Dedicated AC Vehicle with Hill-road experienced driver', 'Tirumala Ghat Toll & Parking charges', 'Local sightseeing: Tiruchanoor Temple & Kapila Theertham', 'Trip Assistance on phone and at Alipiri / Hilltop', 'Complimentary water bottle and temple guide pamphlet'],
    exclusions: ['Official TTD Darshan Ticket (Devotees must carry valid TTD ticket or token)', 'Food & Personal Expenses', 'Special Seva fees payable directly to TTD'],
    itinerary: [
      { time: '06:00 AM', title: 'Pickup & Freshen Up', description: 'Chauffeur receives you at Tirupati Railway Station / Airport.' },
      { time: '07:30 AM', title: 'Alipiri Toll & Ghat Road Ascent', description: 'Vehicle passes Alipiri security gate and ascends the picturesque 7 hills.' },
      { time: '09:00 AM', title: 'Tirumala Srivari Temple Darshan', description: 'Guided entry at Vaikuntam Queue Complex.' },
      { time: '01:30 PM', title: 'Hilltop Sightseeing & Satvic Lunch', description: 'Visit sacred spots: Papavinasam, Akasa Ganga, Silathoranam natural arch.' },
      { time: '04:30 PM', title: 'Ghat Descent & Padmavathi Ammavari Darshan', description: 'Descend to Tiruchanoor to worship Goddess Sri Padmavathi Devi.' },
      { time: '07:30 PM', title: 'Drop at Railway Station / Hotel', description: 'Conclude your divine pilgrimage with blessings and memories.' },
    ],
  },
  {
    id: 'pkg-2',
    slug: '2-day-complete-tirupati-srikalahasti-yatra',
    title: '2-Day Complete Tirumala, Kanipakam & Sri Kalahasti Yatra',
    tagline: 'Holistic Pilgrimage covering Lord Venkateswara, Varasiddhi Vinayaka & Vayu Lingam',
    category: '2 Days / 1 Night',
    duration: '2 Days / 1 Night',
    startingPrice: 4999,
    originalPrice: 6500,
    rating: 4.8,
    reviewCount: 940,
    featured: true,
    badge: 'Complete Circuit',
    thumbnail: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    highlights: ['1 Night 4-Star Hotel Stay in Tirupati with complimentary breakfast', 'Private AC Cab for entire 2 days covering 4 sacred temples', 'Tirumala Venkateswara Swamy Darshan with Laddu assistance', 'Sri Kalahasteeswara Temple (Rahu-Ketu Dosha Nivarana Kshetra)', 'Kanipakam Sri Varasiddhi Vinayaka Temple with Swayambhu idol'],
    inclusions: ['1 Night Stay in AC Deluxe Room (Double Sharing)', 'Buffet Vegetarian Breakfast at Hotel', 'Private AC Sedan / Innova for full 2 days itinerary', 'All Interstate Tolls, Ghat Toll, Driver Beta & Parking Fees', '24/7 Pilgrim Support Helpline'],
    exclusions: ['TTD & Sri Kalahasti Pooja special entry tickets', 'Lunch & Dinner expenses'],
    itinerary: [
      { time: 'Day 1 - Morning', title: 'Arrival in Tirupati & Kanipakam Darshan', description: 'Pickup from station/airport, visit the ancient Swayambhu Varasiddhi Vinayaka Temple in Kanipakam, check-in to hotel.' },
      { time: 'Day 1 - Afternoon & Evening', title: 'Sri Kalahasti Temple Visit', description: 'Drive to Sri Kalahasti (36 km), perform Rahu Ketu Pooja / worship Lord Shiva as Vayu Lingam. Evening Aarti.' },
      { time: 'Day 2 - Full Day', title: 'Sacred Tirumala Darshan & Padmavathi Temple', description: 'Ascend Tirumala hill for Srivari Darshan, visit Papavinasam & Akasa Ganga. Descend for Tiruchanoor Ammavari Darshan and departure drop.' },
    ],
  },
  {
    id: 'pkg-3',
    slug: 'senior-citizen-assisted-darshan-package',
    title: 'Senior Citizen & Differently Abled Special Care Yatra',
    tagline: 'Unhurried, Wheelchair-friendly, Comfortable Pilgrimage with Elder Care Assistant',
    category: 'Special Care',
    duration: '2 Days / 1 Night',
    startingPrice: 5800,
    originalPrice: 7200,
    rating: 5.0,
    reviewCount: 420,
    featured: true,
    badge: 'Elder Care',
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    highlights: ['Unhurried schedule tailored specifically for elders and senior citizens', 'Dedicated local helper to assist with walking, footwear custody, and queue entry', 'Wheelchair arrangement support at temple queue points', 'Ground floor / Elevator adjacent hotel rooms near pure vegetarian restaurants', 'Comfortable Innova Crysta with smooth driving and low step-in height'],
    inclusions: ['1 Night Premium Hotel Stay with Elder-friendly bathroom amenities', 'Dedicated Care Coordinator throughout the journey', 'Toyota Innova Crysta AC Cab with pillow supports and drinking water', 'Wheelchair coordination and battery car transit guidance on Tirumala', 'Prasadam and Laddu delivery straight to vehicle'],
    exclusions: ['Official TTD Senior Citizen Darshan tokens (our team helps with registration process)', 'Medicines & personal nursing'],
    itinerary: [
      { time: 'Day 1', title: 'Gentle Arrival & Rest', description: 'Warm welcome at station/airport, check-in to peaceful hotel, leisurely evening visit to Kapila Theertham & Padmavathi Temple.' },
      { time: 'Day 2', title: 'Assisted Tirumala Darshan', description: 'Smooth morning drive up Tirumala hills via AC Innova. Entry through dedicated Senior Citizen gate at South Mada Street. Relaxed departure.' },
    ],
  },
];

const REVIEWS = [
  { id: 'rev-1', author: 'Ramanathan K.', city: 'Chennai', rating: 5, date: '12 September 2026', comment: 'Booked the 2-Day Package with Innova Crysta for my 78-year old parents. Chauffeur Murugan was like family—drove so gently on the ghat road, helped with wheelchair, and arranged wonderful meals. 10/10 service!', service: 'Senior Citizen Care Package' },
  { id: 'rev-2', author: 'Sunil & Deepa Reddy', city: 'Hyderabad', rating: 5, date: '28 August 2026', comment: 'Fortune Grand Ridge hotel was immaculate and the TTD Yatra coordinator guided us on the exact dress code and token reporting time. Saved us at least 3 hours of confusion. Govinda Govinda!', service: 'Fortune Select Grand Ridge & Cab' },
  { id: 'rev-3', author: 'Ananya Sharma', city: 'Bengaluru', rating: 5, date: '05 September 2026', comment: 'The Bangalore airport pickup to Tirupati was punctual, the Dzire car was spotlessly clean, and our driver guided us on the Kanipakam temple route. Very transparent pricing with no hidden charges.', service: 'Airport Pickup & 1-Day Yatra' },
];

const FAQS = [
  { q: 'Can TTD Yatra guarantee or sell official Tirumala Darshan tickets?', a: 'No. As per strict regulations of Tirumala Tirupati Devasthanams (TTD), official darshan tickets cannot be resold by any agency. We provide complete end-to-end trip logistics (sanitized hotel stays, licensed hill-certified cabs, local coordinators, and step-by-step guidance on how you can book your official TTD quota or obtain SSD tokens).' },
  { q: 'What is the best time of year to visit Tirupati?', a: 'Tirumala has pleasant weather from September to March. Brahmotsavam (typically in September/October) is the grandest festival, while Vaikuntha Ekadashi (December/January) is especially auspicious. Weekdays (Tuesday to Thursday) usually see shorter queue durations compared to weekends.' },
  { q: 'Is it necessary to pre-book a cab for the Tirumala Ghat road?', a: 'Yes, especially during peak seasons and early morning hours (2:00 AM – 5:00 AM). Local public taxis often charge arbitrary rates. Pre-booking with TTD Yatra guarantees fixed rates, experienced ghat drivers, and reliable pickup at your hotel doorstep.' },
  { q: 'What are the cancellation and refund terms for hotel and cab bookings?', a: 'You can cancel up to 24 hours prior to your scheduled check-in or pickup for a 100% full refund to your original payment method. Cancellations within 24 hours carry a nominal 10% processing fee.' },
  { q: 'Are mobile phones and electronics allowed inside the Tirumala Temple?', a: 'No. Mobile phones, smart watches, cameras, and electronic luggage are strictly banned inside the sanctum sanctorum. TTD provides free secure locker counters at the Vaikuntam Queue Complex, or you can safely leave them in your TTD Yatra cab under our driver custody.' },
];

// ─── Health ───────────────────────────────────────────────────────────────────
router.get('/health', getHealth);

// ─── Hotels ───────────────────────────────────────────────────────────────────
router.get('/hotels', (req, res) => {
  let results = [...HOTELS];
  const { vegOnly, star, maxPrice, sort } = req.query;
  if (vegOnly === 'true') results = results.filter((h) => h.vegOnly);
  if (star) {
    const stars = String(star).split(',').map(Number);
    results = results.filter((h) => stars.includes(h.starRating));
  }
  if (maxPrice) results = results.filter((h) => h.pricePerNight <= Number(maxPrice));
  if (sort === 'price-low') results.sort((a, b) => a.pricePerNight - b.pricePerNight);
  else if (sort === 'price-high') results.sort((a, b) => b.pricePerNight - a.pricePerNight);
  else if (sort === 'rating') results.sort((a, b) => b.reviewRating - a.reviewRating);
  res.json({ success: true, count: results.length, data: results });
});

router.get('/hotels/:slug', (req, res) => {
  const hotel = HOTELS.find((h) => h.slug === req.params.slug) || HOTELS[0];
  res.json({ success: true, data: hotel });
});

// ─── Cars ─────────────────────────────────────────────────────────────────────
router.get('/cars', (req, res) => {
  let results = [...CARS];
  const { ac, sort } = req.query;
  if (ac === 'true') results = results.filter((c) => c.ac);
  if (sort === 'price-low') results.sort((a, b) => a.pricePerDay - b.pricePerDay);
  else if (sort === 'price-high') results.sort((a, b) => b.pricePerDay - a.pricePerDay);
  res.json({ success: true, count: results.length, data: results });
});

router.get('/cars/:slug', (req, res) => {
  const car = CARS.find((c) => c.slug === req.params.slug) || CARS[0];
  res.json({ success: true, data: car });
});

// ─── Packages ─────────────────────────────────────────────────────────────────
router.get('/packages', (req, res) => {
  let results = [...PACKAGES];
  const { duration } = req.query;
  if (duration === '1-day') results = results.filter((p) => p.duration.includes('1 Day'));
  else if (duration === '2-day') results = results.filter((p) => p.duration.includes('2 Days'));
  else if (duration === 'elder') results = results.filter((p) => p.category.toLowerCase().includes('special'));
  res.json({ success: true, count: results.length, data: results });
});

router.get('/packages/:slug', (req, res) => {
  const pkg = PACKAGES.find((p) => p.slug === req.params.slug) || PACKAGES[0];
  res.json({ success: true, data: pkg });
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
router.get('/reviews', (req, res) => {
  res.json({ success: true, count: REVIEWS.length, data: REVIEWS });
});

// ─── FAQs ─────────────────────────────────────────────────────────────────────
router.get('/faqs', (req, res) => {
  res.json({ success: true, count: FAQS.length, data: FAQS });
});

// ─── Data Stores (In-Memory with Mock Defaults) ───────────────────────────────

let BOOKINGS = [
  {
    bookingId: 'bk_1727530000001',
    pnr: 'TTY-2026-83412',
    status: 'Confirmed',
    type: 'package',
    itemName: '1-Day Express VIP Break Darshan & Tirumala Yatra',
    amount: 4998,
    date: '2026-10-05',
    travellers: 2,
    leadPilgrim: { name: 'Venkatesh Prasad', phone: '+91 98765 43210', email: 'devotee@ttdyatra.com', city: 'Bengaluru' },
    paymentMethod: 'UPI (Google Pay)',
    createdAt: '2026-09-28T09:30:00Z',
    notes: 'Requested early morning 5:30 AM pickup from Tirupati Railway Station.'
  },
  {
    bookingId: 'bk_1727530000002',
    pnr: 'TTY-2026-62191',
    status: 'Completed',
    type: 'hotel',
    itemName: 'Pai Viceroy Hotel - Superior Twin Room',
    amount: 3200,
    date: '2026-09-20',
    travellers: 2,
    leadPilgrim: { name: 'Ramanathan K.', phone: '+91 94440 12345', email: 'ramanathan@gmail.com', city: 'Chennai' },
    paymentMethod: 'Credit Card (HDFC)',
    createdAt: '2026-09-18T14:15:00Z',
    notes: 'Elderly pilgrims. Ground floor room allocated.'
  },
  {
    bookingId: 'bk_1727530000003',
    pnr: 'TTY-2026-91483',
    status: 'Confirmed',
    type: 'car',
    itemName: 'Toyota Innova Crysta (Luxury 7-Seater)',
    amount: 3600,
    date: '2026-10-02',
    travellers: 5,
    leadPilgrim: { name: 'Sunil Reddy', phone: '+91 98490 55678', email: 'sunil.reddy@yahoo.com', city: 'Hyderabad' },
    paymentMethod: 'NetBanking (SBI)',
    createdAt: '2026-09-27T18:20:00Z',
    notes: 'Assigned Driver: Ramesh (12y Ghat experience).'
  },
  {
    bookingId: 'bk_1727530000004',
    pnr: 'TTY-2026-44120',
    status: 'Pending',
    type: 'package',
    itemName: 'Senior Citizen & Differently Abled Special Care Yatra',
    amount: 11600,
    date: '2026-10-12',
    travellers: 2,
    leadPilgrim: { name: 'Srinivasa Murthy', phone: '+91 97312 88990', email: 'murthy.s@gmail.com', city: 'Mysuru' },
    paymentMethod: 'Pending Gateway Confirmation',
    createdAt: '2026-09-29T06:10:00Z',
    notes: 'Needs wheelchair assistance at Vaikuntam queue.'
  },
  {
    bookingId: 'bk_1727530000005',
    pnr: 'TTY-2026-18902',
    status: 'Cancelled',
    type: 'hotel',
    itemName: 'Fortune Select Grand Ridge - Deluxe AC Room',
    amount: 4800,
    date: '2026-09-25',
    travellers: 3,
    leadPilgrim: { name: 'Ananya Sharma', phone: '+91 98110 33445', email: 'ananya.s@outlook.com', city: 'Delhi' },
    paymentMethod: 'UPI (PhonePe)',
    createdAt: '2026-09-22T11:00:00Z',
    notes: 'Cancelled due to train delay. 100% refund processed.'
  },
  {
    bookingId: 'bk_1727530000006',
    pnr: 'TTY-2026-77319',
    status: 'Confirmed',
    type: 'car',
    itemName: 'Force Tempo Traveller (12 & 14 Seater)',
    amount: 11600,
    date: '2026-10-18',
    travellers: 12,
    leadPilgrim: { name: 'K. Balaji Rao', phone: '+91 99001 22334', email: 'balajirao@gmail.com', city: 'Bengaluru' },
    paymentMethod: 'UPI (Paytm)',
    createdAt: '2026-09-29T04:45:00Z',
    notes: 'Bhajan Mandali group yatra with temple halts.'
  }
];

let USERS = [
  {
    _id: 'usr_101',
    name: 'Venkatesh Prasad',
    email: 'devotee@ttdyatra.com',
    phone: '+91 98765 43210',
    role: 'devotee',
    status: 'Active',
    totalBookings: 2,
    createdAt: '2026-08-10'
  },
  {
    _id: 'usr_admin',
    name: 'Administrator Desk',
    email: 'admin@ttdyatra.com',
    phone: '+91 91483 91081',
    role: 'admin',
    status: 'Active',
    totalBookings: 0,
    createdAt: '2026-01-01'
  },
  {
    _id: 'usr_102',
    name: 'Ramanathan K.',
    email: 'ramanathan@gmail.com',
    phone: '+91 94440 12345',
    role: 'devotee',
    status: 'Active',
    totalBookings: 1,
    createdAt: '2026-09-01'
  },
  {
    _id: 'usr_103',
    name: 'Sunil Reddy',
    email: 'sunil.reddy@yahoo.com',
    phone: '+91 98490 55678',
    role: 'devotee',
    status: 'Active',
    totalBookings: 1,
    createdAt: '2026-09-15'
  },
  {
    _id: 'usr_104',
    name: 'Srinivasa Murthy',
    email: 'murthy.s@gmail.com',
    phone: '+91 97312 88990',
    role: 'devotee',
    status: 'Active',
    totalBookings: 1,
    createdAt: '2026-09-20'
  }
];

let ENQUIRIES = [
  {
    id: 'enq-1',
    name: 'Dr. Madhavan Nair',
    phone: '+91 98450 11223',
    email: 'madhavan.nair@apollo.org',
    city: 'Kochi',
    serviceType: 'Senior Citizen Package + Wheelchair',
    travellersCount: 4,
    preferredDate: '2026-10-25',
    message: 'Bringing my 84-year old mother for her first Tirumala darshan. Require continuous helper and wheelchair guidance.',
    status: 'New',
    createdAt: '2026-09-29T08:15:00Z'
  },
  {
    id: 'enq-2',
    name: 'Lakshmi Narayana',
    phone: '+91 94401 98765',
    email: 'lakshmi.narayana@tcs.com',
    city: 'Hyderabad',
    serviceType: 'VIP Break Darshan Guidance & 2-Day Innova',
    travellersCount: 6,
    preferredDate: '2026-11-04',
    message: 'Need 2-day itinerary covering Tirumala Swamy and Sri Kalahasti Rahu Ketu Pooja. Please share custom quote.',
    status: 'Contacted',
    createdAt: '2026-09-28T16:00:00Z'
  },
  {
    id: 'enq-3',
    name: 'Gowtham Kumar',
    phone: '+91 98800 55443',
    email: 'gowtham.k@gmail.com',
    city: 'Chennai',
    serviceType: '1-Day Express Package',
    travellersCount: 3,
    preferredDate: '2026-10-08',
    message: 'Arriving at Renigunta airport at 7:30 AM. Need cab pickup and same-day return drop.',
    status: 'Converted',
    createdAt: '2026-09-27T12:30:00Z'
  }
];

let TERMS_DATA = {
  lastUpdated: 'September 2026',
  disclaimer: 'TTDYATRA is a premier independent devotional travel facilitator and concierge. We are NOT affiliated with, authorized by, or an agent of Tirumala Tirupati Devasthanams (TTD). All official darshan tokens, pooja sevas, and laddus are governed exclusively by TTD rules.',
  termsOfService: `1. Acceptance of Terms
By accessing or using the TTD Yatra platform (website, mobile interfaces, or phone booking desk), you agree to be bound by these Terms of Service. If you do not agree, please refrain from booking or accessing our services.

2. Scope of Services
TTDYATRA provides pilgrim travel assistance, including hill-certified private cab rentals, curated vegetarian hotel accommodations, certified guide coordination, and step-by-step darshan reporting advisory. We do not sell or alter official TTD tickets.

3. Pilgrim Identification & Documentation
All devotees, including children above 12 years of age, must carry valid government-issued original photo ID proofs (Aadhaar Card, Indian Passport, or Voter ID). The names on travel bookings and hotel room allocations must match official identity credentials.

4. Sacred Temple Code of Conduct
Pilgrims utilizing our transportation, stay, and guide services are strictly required to observe traditional Vedic decorum, including mandatory temple dress codes (Dhoti/Kurta or Pyjama with Angavastram for men; Saree or Half-Saree or Chudidar with Dupatta for women). Western wear (jeans, shorts, sleeveless, mini-skirts) is prohibited in the sanctum sanctorum.

5. Ghat Road Safety & Transit Timing
Transit on Tirumala Hill Ghat Road is strictly monitored by TTD automated speed cameras. Minimum travel time between Alipiri Toll Gate and Tirumala is 28 minutes for safety compliance. Our certified chauffeurs are strictly instructed never to overspeed or stop unlawfully in tiger corridor zones.

6. Limitation of Liability
TTDYATRA shall not be held liable for sudden changes in TTD darshan queue timings, VIP protocol halts, temple closures, or natural weather advisories beyond our reasonable logistical control.`,

  privacyPolicy: `1. Information We Collect
We collect personal information necessary to deliver travel services, including full names, contact telephone numbers, email addresses, residential cities, and ID proof types provided during checkout or enquiry.

2. Use of Information
Your information is strictly utilized to:
• Coordinate hotel check-ins and room allocations
• Dispatch driver and cab assignment SMS/WhatsApp notifications
• Provide emergency pilgrim assistance during your stay in Tirupati
• Send invoice receipts and booking vouchers

3. No Selling of Pilgrim Data
We uphold the highest standard of sanctity and privacy. Devotee contact information is never sold, traded, or shared with third-party telemarketers.

4. Payment Security
All online payment transactions are processed via RBI-authorized, PCI-DSS compliant payment gateways with 256-bit SSL encryption. We do not store credit card or debit card CVV/PIN credentials on our servers.`,

  refundPolicy: `1. Free Cancellation Window
Devotees may cancel hotel or vehicle reservations up to 24 hours prior to the scheduled pickup or check-in time for a 100% full refund with ZERO cancellation charges.

2. Standard Cancellation (< 24 Hours)
For cancellations made within 24 hours of scheduled arrival or service commencement, a nominal 10% administrative processing fee will be retained, and 90% of the total amount will be refunded.

3. Emergency & Train / Flight Delay Protection
If your arrival in Tirupati is delayed or cancelled due to certified train or airline cancellations, we allow complimentary rescheduling to any available date within 90 days, or an 85% immediate refund upon verification.

4. Refund Disbursement Timelines
Approved refunds are initiated within 2 business hours and reflect in the original payment bank account or UPI handle within 3 to 5 business days, subject to the issuing bank's clearing cycle.`,

  ghatRoadRules: `• Alipiri Toll Gate opens at 03:00 AM and closes at 12:00 Midnight.
• Downhill Ghat Road opens at 03:00 AM and closes at 12:00 Midnight.
• Minimum transit time limit of 28 minutes on Up-ghat road and 40 minutes on Down-ghat road must be maintained to avoid automatic fines.
• Two-wheelers are permitted only between 04:00 AM and 08:00 PM.
• Carrying alcohol, tobacco, non-vegetarian food, or plastics onto the sacred hills is strictly forbidden and punishable by law.`,

  announcementBanner: {
    enabled: true,
    text: '🕉️ TTD Special Entry Darshan (₹300) Quota releases on 24th Oct 10:00 AM IST. Pre-book your sanitized cab & stay with zero cancellation charges!',
    badge: 'Important Update'
  }
};

let SETTINGS = {
  helplinePhone: '+91 91483 91081',
  whatsappNumber: '+91 91483 91081',
  supportEmail: 'darshan@ttdyatra.com',
  officeAddress: '19-3-2R, Renigunta Road, Korlagunta, Tirupati - 517501',
  paymentGatewayLive: true,
  enableSmsAlerts: true,
  enableWhatsAppAlerts: true,
  maxDailyBookingsLimit: 150,
  elderModeDefault: false
};

// ─── Terms & CMS Endpoints (Public & Admin) ──────────────────────────────────

router.get('/terms', (req, res) => {
  res.json({ success: true, data: TERMS_DATA });
});

router.get('/terms/:type', (req, res) => {
  const { type } = req.params;
  let content = '';
  let title = '';

  if (type === 'terms' || type === 'terms-of-service') {
    title = 'Terms of Service — TTD Yatra';
    content = TERMS_DATA.termsOfService;
  } else if (type === 'privacy' || type === 'privacy-policy') {
    title = 'Privacy Policy — TTD Yatra';
    content = TERMS_DATA.privacyPolicy;
  } else if (type === 'refund' || type === 'refund-policy' || type === 'cancellation') {
    title = 'Cancellation & Refund Policy — TTD Yatra';
    content = TERMS_DATA.refundPolicy;
  } else {
    return res.status(404).json({ success: false, message: 'Policy document not found' });
  }

  res.json({
    success: true,
    data: {
      type,
      title,
      content,
      lastUpdated: TERMS_DATA.lastUpdated
    }
  });
});

router.get('/admin/terms', (req, res) => {
  res.json({ success: true, data: TERMS_DATA });
});

router.put('/admin/terms', (req, res) => {
  TERMS_DATA = {
    ...TERMS_DATA,
    ...req.body,
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })
  };
  res.json({ success: true, message: 'Terms and legal policies updated successfully', data: TERMS_DATA });
});


// ─── Admin Overview & Analytics ───────────────────────────────────────────────

router.get('/admin/overview', (req, res) => {
  const totalRevenue = BOOKINGS
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const confirmedBookings = BOOKINGS.filter(b => b.status === 'Confirmed').length;
  const pendingBookings = BOOKINGS.filter(b => b.status === 'Pending').length;
  const completedBookings = BOOKINGS.filter(b => b.status === 'Completed').length;
  const openEnquiries = ENQUIRIES.filter(e => e.status !== 'Converted' && e.status !== 'Closed').length;

  res.json({
    success: true,
    data: {
      stats: {
        totalRevenue,
        totalBookings: BOOKINGS.length,
        confirmedBookings,
        pendingBookings,
        completedBookings,
        totalDevotees: USERS.filter(u => u.role === 'devotee').length,
        hotelsCount: HOTELS.length,
        carsCount: CARS.length,
        packagesCount: PACKAGES.length,
        openEnquiries
      },
      recentBookings: BOOKINGS.slice(0, 5),
      recentEnquiries: ENQUIRIES.slice(0, 5),
      monthlyRevenue: [
        { month: 'May', revenue: 145000, bookings: 32 },
        { month: 'Jun', revenue: 182000, bookings: 44 },
        { month: 'Jul', revenue: 210000, bookings: 51 },
        { month: 'Aug', revenue: 275000, bookings: 68 },
        { month: 'Sep', revenue: 340000, bookings: 86 }
      ]
    }
  });
});

// ─── Admin Bookings Management ────────────────────────────────────────────────

router.get('/admin/bookings', (req, res) => {
  let list = [...BOOKINGS];
  const { status, type, search } = req.query;

  if (status && status !== 'all') {
    list = list.filter(b => b.status.toLowerCase() === status.toLowerCase());
  }
  if (type && type !== 'all') {
    list = list.filter(b => b.type.toLowerCase() === type.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(b =>
      b.pnr.toLowerCase().includes(q) ||
      (b.leadPilgrim?.name && b.leadPilgrim.name.toLowerCase().includes(q)) ||
      (b.leadPilgrim?.phone && b.leadPilgrim.phone.includes(q)) ||
      (b.itemName && b.itemName.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: list.length, data: list });
});

router.post('/admin/bookings', (req, res) => {
  const pnr = `TTY-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const newBooking = {
    bookingId: 'bk_' + Date.now(),
    pnr,
    status: req.body.status || 'Confirmed',
    createdAt: new Date().toISOString(),
    ...req.body
  };
  BOOKINGS.unshift(newBooking);
  res.status(201).json({ success: true, message: 'Booking created successfully', data: newBooking });
});

router.put('/admin/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const booking = BOOKINGS.find(b => b.bookingId === id || b.pnr === id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  if (status) booking.status = status;
  if (notes) booking.notes = notes;
  res.json({ success: true, message: `Booking status changed to ${status}`, data: booking });
});

router.delete('/admin/bookings/:id', (req, res) => {
  const { id } = req.params;
  const idx = BOOKINGS.findIndex(b => b.bookingId === id || b.pnr === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  BOOKINGS.splice(idx, 1);
  res.json({ success: true, message: 'Booking removed successfully' });
});

// ─── Admin Hotels Management ──────────────────────────────────────────────────

router.get('/admin/hotels', (req, res) => {
  res.json({ success: true, count: HOTELS.length, data: HOTELS });
});

router.post('/admin/hotels', (req, res) => {
  const newHotel = {
    id: 'hotel-' + (HOTELS.length + 1),
    slug: (req.body.name || 'hotel').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    starRating: 4,
    reviewRating: 4.8,
    reviewCount: 1,
    rooms: [
      { id: 'r-' + Date.now(), name: 'Deluxe AC Room', price: req.body.pricePerNight || 3000, originalPrice: (req.body.pricePerNight || 3000) * 1.25, maxGuests: 3 }
    ],
    amenities: ['Free Wi-Fi', '24h Hot Water', 'Pure Veg Dining', 'Car Parking'],
    images: [req.body.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    ...req.body
  };
  HOTELS.unshift(newHotel);
  res.status(201).json({ success: true, message: 'Hotel added successfully', data: newHotel });
});

router.put('/admin/hotels/:id', (req, res) => {
  const { id } = req.params;
  const hotel = HOTELS.find(h => h.id === id || h.slug === id);
  if (!hotel) {
    return res.status(404).json({ success: false, message: 'Hotel not found' });
  }
  Object.assign(hotel, req.body);
  res.json({ success: true, message: 'Hotel updated successfully', data: hotel });
});

router.delete('/admin/hotels/:id', (req, res) => {
  const { id } = req.params;
  const idx = HOTELS.findIndex(h => h.id === id || h.slug === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Hotel not found' });
  }
  HOTELS.splice(idx, 1);
  res.json({ success: true, message: 'Hotel removed successfully' });
});

// ─── Admin Cars Management ────────────────────────────────────────────────────

router.get('/admin/cars', (req, res) => {
  res.json({ success: true, count: CARS.length, data: CARS });
});

router.post('/admin/cars', (req, res) => {
  const newCar = {
    id: 'car-' + (CARS.length + 1),
    slug: (req.body.name || 'car').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    rating: 4.8,
    reviewCount: 1,
    features: ['Experienced Hill Driver', 'AC Cabin', 'Mineral Water Provided'],
    driverDetails: { languages: ['Telugu', 'Hindi', 'English'], experienceYears: '8+ Years' },
    ...req.body
  };
  CARS.unshift(newCar);
  res.status(201).json({ success: true, message: 'Car added to fleet successfully', data: newCar });
});

router.put('/admin/cars/:id', (req, res) => {
  const { id } = req.params;
  const car = CARS.find(c => c.id === id || c.slug === id);
  if (!car) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  Object.assign(car, req.body);
  res.json({ success: true, message: 'Vehicle updated successfully', data: car });
});

router.delete('/admin/cars/:id', (req, res) => {
  const { id } = req.params;
  const idx = CARS.findIndex(c => c.id === id || c.slug === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  CARS.splice(idx, 1);
  res.json({ success: true, message: 'Vehicle removed from fleet' });
});

// ─── Admin Packages Management ────────────────────────────────────────────────

router.get('/admin/packages', (req, res) => {
  res.json({ success: true, count: PACKAGES.length, data: PACKAGES });
});

router.post('/admin/packages', (req, res) => {
  const newPkg = {
    id: 'pkg-' + (PACKAGES.length + 1),
    slug: (req.body.title || 'package').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    rating: 4.9,
    reviewCount: 1,
    highlights: req.body.highlights || ['Dedicated Chauffeur & AC Cab', 'Temple darshan coordination'],
    inclusions: req.body.inclusions || ['AC Vehicle & Hill road driver', 'Toll and parking charges'],
    exclusions: req.body.exclusions || ['Official TTD Darshan Ticket', 'Personal expenses'],
    itinerary: req.body.itinerary || [
      { time: '07:00 AM', title: 'Pickup & Ghat Transit', description: 'Chauffeur receives pilgrims at Tirupati' },
      { time: '10:00 AM', title: 'Srivari Temple Darshan', description: 'Assisted reporting at queue complex' }
    ],
    ...req.body
  };
  PACKAGES.unshift(newPkg);
  res.status(201).json({ success: true, message: 'Package created successfully', data: newPkg });
});

router.put('/admin/packages/:id', (req, res) => {
  const { id } = req.params;
  const pkg = PACKAGES.find(p => p.id === id || p.slug === id);
  if (!pkg) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }
  Object.assign(pkg, req.body);
  res.json({ success: true, message: 'Package updated successfully', data: pkg });
});

router.delete('/admin/packages/:id', (req, res) => {
  const { id } = req.params;
  const idx = PACKAGES.findIndex(p => p.id === id || p.slug === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }
  PACKAGES.splice(idx, 1);
  res.json({ success: true, message: 'Package removed successfully' });
});

// ─── Admin Users Management ───────────────────────────────────────────────────

router.get('/admin/users', (req, res) => {
  res.json({ success: true, count: USERS.length, data: USERS });
});

router.put('/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const user = USERS.find(u => u._id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  Object.assign(user, req.body);
  res.json({ success: true, message: 'User profile updated', data: user });
});

// ─── Admin Enquiries Management ───────────────────────────────────────────────

router.get('/admin/enquiries', (req, res) => {
  res.json({ success: true, count: ENQUIRIES.length, data: ENQUIRIES });
});

router.put('/admin/enquiries/:id', (req, res) => {
  const { id } = req.params;
  const enq = ENQUIRIES.find(e => e.id === id);
  if (!enq) {
    return res.status(404).json({ success: false, message: 'Enquiry not found' });
  }
  Object.assign(enq, req.body);
  res.json({ success: true, message: 'Enquiry updated', data: enq });
});

// ─── Admin Settings ───────────────────────────────────────────────────────────

router.get('/admin/settings', (req, res) => {
  res.json({ success: true, data: SETTINGS });
});

router.put('/admin/settings', (req, res) => {
  SETTINGS = { ...SETTINGS, ...req.body };
  res.json({ success: true, message: 'Settings saved successfully', data: SETTINGS });
});

// ─── Public Bookings Endpoints ────────────────────────────────────────────────

router.post('/bookings', (req, res) => {
  const pnr = `TTY-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const bookingId = 'bk_' + Date.now();
  const newBooking = {
    id: bookingId,
    bookingId,
    pnr,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    ...req.body
  };
  BOOKINGS.unshift(newBooking);
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: newBooking
  });
});

router.get('/bookings', (req, res) => {
  res.json({
    success: true,
    count: BOOKINGS.length,
    data: BOOKINGS
  });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

router.post('/auth/register', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Registration successful. OTP sent to your mobile number.',
    data: { otpSent: true }
  });
});

router.post('/auth/login', (req, res) => {
  const email = req.body.email || '';
  const isAdmin = email.toLowerCase().includes('admin') || req.body.isAdmin;
  const user = {
    _id: isAdmin ? 'usr_admin' : 'usr_101',
    name: isAdmin ? 'Administrator Desk' : 'Venkatesh Prasad',
    email: req.body.email || (isAdmin ? 'admin@ttdyatra.com' : 'devotee@ttdyatra.com'),
    phone: req.body.phone || (isAdmin ? '+91 91483 91081' : '+91 98765 43210'),
    role: isAdmin ? 'admin' : 'devotee',
    avatar: null
  };
  res.json({
    success: true,
    data: {
      user,
      accessToken: 'jwt_mock_token_ttdyatra'
    }
  });
});

router.post('/auth/send-otp', (req, res) => {
  res.json({ success: true, message: 'OTP sent successfully', data: { otpSent: true } });
});

router.post('/auth/verify-otp', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { _id: 'usr_101', name: 'Venkatesh Prasad', email: 'devotee@ttdyatra.com', phone: req.body.phone || '+91 98765 43210', role: 'devotee' },
      accessToken: 'jwt_mock_token_ttdyatra'
    }
  });
});

router.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  res.json({
    success: true,
    data: {
      _id: 'usr_101',
      name: 'Venkatesh Prasad',
      email: 'devotee@ttdyatra.com',
      phone: '+91 98765 43210',
      role: 'devotee'
    }
  });
});

// ─── Contact / Enquiry ────────────────────────────────────────────────────────

const handleEnquiry = (req, res) => {
  const newEnq = {
    id: 'enq-' + (ENQUIRIES.length + 1),
    name: req.body.name || 'Devotee',
    phone: req.body.phone || '',
    email: req.body.email || '',
    city: req.body.city || '',
    serviceType: req.body.serviceType || req.body.subject || 'Trip Inquiry',
    travellersCount: req.body.travellers || req.body.guests || 2,
    preferredDate: req.body.date || req.body.travelDate || 'Soon',
    message: req.body.message || '',
    status: 'New',
    createdAt: new Date().toISOString()
  };
  ENQUIRIES.unshift(newEnq);
  res.status(201).json({ success: true, message: 'Thank you! We will get back to you within 30 minutes.', data: newEnq });
};

router.post('/contact', handleEnquiry);
router.post('/enquiries', handleEnquiry);
router.get('/enquiries', (req, res) => {
  res.json({ success: true, count: ENQUIRIES.length, data: ENQUIRIES });
});


export default router;
