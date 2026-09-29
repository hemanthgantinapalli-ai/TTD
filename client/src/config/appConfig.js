// TTDYATRA App-level configuration

export const APP_CONFIG = {
  name: 'TTDYATRA',
  tagline: 'Sacred journeys to Tirumala, arranged with care.',
  description: 'Hotels, car rentals and end-to-end trip assistance for your Tirumala–Tirupati pilgrimage. We handle the details so you can focus on the darshan.',
  contact: {
    phone: '+91 86887 78104',
    phoneRaw: '+918688778104',
    whatsapp: 'https://wa.me/918688778104',
    email: 'hemanthgantinapalli@gmail.com',
    address: 'Tirupati, Andhra Pradesh, India',
  },
  social: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    youtube: '#',
  },
  official_ttd_url: 'https://www.tirumala.org/',
  disclaimer: 'TTDYATRA is an independent travel service and is not affiliated with or endorsed by Tirumala Tirupati Devasthanams (TTD).',
};

export const BOOKING_HOLD_DURATION_MINUTES = 10;
export const OTP_EXPIRY_MINUTES = 5;
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_RESEND_SECONDS = 30;
export const JWT_ACCESS_EXPIRY = '15m';
export const JWT_REFRESH_EXPIRY = '7d';

export const BOOKING_NUMBER_PREFIX = 'TTY';

export const PAYMENT_METHODS = ['upi', 'card', 'netbanking', 'wallet'];

export const SERVICES = [
  {
    id: 'hotels',
    title: 'Hotels & Stays',
    description: 'Hand-picked, comfortable stays close to the temple — from budget lodges to premium rooms, booked to suit your darshan timing.',
    icon: 'hotel',
    link: '/hotels',
    anchorLink: '/services#hotels',
  },
  {
    id: 'cars',
    title: 'Car Rentals',
    description: 'Clean, well-maintained cabs with experienced local drivers — airport pickups, local sightseeing, and the Tirumala ghat road.',
    icon: 'car',
    link: '/cars',
    anchorLink: '/services#cars',
  },
  {
    id: 'assistance',
    title: 'Trip Assistance',
    description: 'End-to-end planning: darshan guidance, stay, transport and local sightseeing arranged into one smooth, worry-free journey.',
    icon: 'compass',
    link: '/trip-assistance',
    anchorLink: '/services#assistance',
  },
  {
    id: 'packages',
    title: 'Trip Packages',
    description: 'Thoughtfully planned pilgrimage packages you can book as-is or tailor to your family, with everything included.',
    icon: 'package',
    link: '/packages',
    anchorLink: '/packages',
  },
];

export const WHY_US = [
  {
    id: 'local',
    title: 'Local expertise',
    description: 'We are based in Tirupati and know darshan timings, routes and the right stays — so your trip runs smoothly.',
  },
  {
    id: 'end-to-end',
    title: 'End-to-end planning',
    description: 'Hotel, cab and sightseeing arranged together as one trip, with one point of contact for everything.',
  },
  {
    id: 'transparent',
    title: 'Transparent & fair',
    description: 'Clear, honest pricing with no hidden charges. You know exactly what your journey includes.',
  },
  {
    id: 'caring',
    title: 'Caring support',
    description: 'Travelling with elders or children? We plan an unhurried pace and stay reachable throughout.',
  },
];

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Share your plan',
    description: 'Tell us your dates, group size and what you need — stay, cab, darshan help, or a full package.',
  },
  {
    step: '02',
    title: 'We arrange everything',
    description: 'We put together the right hotel, vehicle and itinerary and confirm the details with you.',
  },
  {
    step: '03',
    title: 'Travel worry-free',
    description: 'Arrive and enjoy your darshan. We look after the logistics from start to finish.',
  },
];
