import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

export const MOCK_BLOGS = [
  {
    id: 'blog-1',
    slug: 'complete-guide-to-ttd-300-special-entry-darshan',
    title: 'Complete Guide to ₹300 Special Entry Darshan (SED) in 2026',
    date: '15 September 2026',
    category: 'Darshan Guide',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    summary: 'Everything you need to know about booking the online ₹300 quota on the official TTD portal, reporting at Vaikuntam Queue Complex, and tips to minimize waiting time.',
    content: `The ₹300 Special Entry Darshan (also known as Seeghra Darshan) is the most popular and predictable way for devotees to receive Lord Venkateswara's blessings without enduring the 15-20 hour Sarva Darshan queues.
    
    1. Online Quota Releases:
    TTD typically opens the quota 2 to 3 months in advance on their official website (ttdevasthanams.ap.gov.in). Always keep your Aadhaar details and active mobile number ready.
    
    2. Reporting Point:
    SED devotees report directly at ATC Car Parking entrance in Tirumala. Arrive 30 minutes before your allotted slot.
    
    3. What to Carry:
    Printout of the SED ticket with barcode, and original Aadhaar / Passport corresponding to the devotee name.`,
  },
  {
    id: 'blog-2',
    slug: 'tirumala-dress-code-what-is-strictly-allowed-and-banned',
    title: 'Tirumala Vedic Dress Code: What Devotees Must Wear',
    date: '02 September 2026',
    category: 'Temple Protocol',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    summary: 'Avoid getting stopped at the queue entrance! Understand the strictly enforced dress code rules for men, women, and children visiting the Tirumala sanctum.',
    content: `Tirumala Tirupati Devasthanams strictly enforces traditional Indian Vedic attire to maintain the sanctity of the temple premises.

    • Men: White Dhoti / Veshti with Angavastram, or Kurta Pyjama. Jeans, T-shirts, shorts, and Bermudas are prohibited.
    • Women: Saree, Half-Saree (Pavadai), or Churidar / Salwar Kameez with Dupatta properly pinned across shoulders.
    • Electronic Luggage: Mobile phones and electronic gadgets must be surrendered before queue entry.`,
  },
  {
    id: 'blog-3',
    slug: 'best-time-to-visit-tirupati-weather-festivals-queue-times',
    title: 'Best Time to Visit Tirupati: Weather, Festivals & Crowd Calendar',
    date: '20 August 2026',
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    summary: 'A seasonal breakdown of pilgrimage footfalls in Tirumala, weather conditions across the year, and auspicious festival dates like Brahmotsavam and Vaikuntha Ekadashi.',
    content: `Planning your pilgrimage on the right dates can make a huge difference in queue duration and weather comfort.

    • Best Weather: September to February offers pleasant, cool hill temperatures.
    • Mid-Week Secret: Tuesday through Thursday generally experience 30-40% lower crowd densities compared to weekends.
    • Grand Festivals: Srivari Salakatla Brahmotsavam is celebrated with unmatched grandeur every September/October.`,
  }
];

const BlogsList = () => {
  return (
    <div className="blogs-page">
      <div className="section" style={{ background: 'linear-gradient(170deg, #FAF0F2 0%, #FBF7EF 100%)', padding: '56px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <span className="eyebrow">Pilgrim Insights & Tips</span>
          <h1 className="text-maroon font-display" style={{ marginTop: '8px' }}>
            TTD Yatra Pilgrimage Blog & Guides
          </h1>
          <p className="text-muted" style={{ maxWidth: '650px', margin: '8px auto 0' }}>
            Expert articles on darshan rules, quota tips, local temples, and insider guides to Tirumala.
          </p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {MOCK_BLOGS.map((blog) => (
            <div key={blog.id} className="card card-lift" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} loading="lazy" />
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-gold">{blog.category}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{blog.date}</span>
                </div>

                <h2 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '8px', lineHeight: 1.4 }}>
                  <Link to={ROUTES.BLOG_DETAIL(blog.slug)} className="link-underline">
                    {blog.title}
                  </Link>
                </h2>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                  {blog.summary}
                </p>

                <Link to={ROUTES.BLOG_DETAIL(blog.slug)} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                  Read Article →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsList;
