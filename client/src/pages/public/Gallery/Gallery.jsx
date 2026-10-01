import React from 'react';
import PageHeader from '../../../components/common/PageHeader/PageHeader';

const GALLERY_ITEMS = [
  {
    title: 'Sacred Tirumala Srivari Temple Gopuram',
    caption: 'The golden Ananda Nilayam vimanam and towering Rajagopuram at dusk.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    category: 'Temples',
  },
  {
    title: 'Alipiri Foot-Hills Step Path (Sopana Margam)',
    caption: 'Devotees trekking the 3,550 holy stone steps to Tirumala.',
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    category: 'Pilgrimage',
  },
  {
    title: 'Scenic 7 Hills Tirumala Ghat Road',
    caption: 'Winding scenic mountain road connecting Tirupati valley to hilltop.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    category: 'Scenery',
  },
  {
    title: 'Swami Pushkarini Holy Tank',
    caption: 'Sacred pond beside Sri Varahaswamy Temple for pre-darshan ritual bath.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    category: 'Sacred Sites',
  },
  {
    title: 'Kapila Theertham Waterfalls',
    caption: 'Ancient Shiva temple nestled at the foot of the sacred hills.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    category: 'Temples',
  },
  {
    title: 'Silathoranam Natural Rock Arch',
    caption: 'Prehistoric natural geological wonder atop Tirumala hills.',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    category: 'Sacred Sites',
  }
];

const Gallery = () => {
  return (
    <div className="gallery-page">
      <PageHeader
        eyebrow="SACRED VISUALS"
        title="TIRUPATI & TIRUMALA PHOTO GALLERY"
        subtitle="A glimpse into the divine beauty, spiritual heritage, and mountain landscapes of Lord Venkateswara's holy abode."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Gallery' },
        ]}
      />

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {GALLERY_ITEMS.map((item, idx) => (
            <div key={idx} className="card card-lift" style={{ overflow: 'hidden' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} loading="lazy" />
              <div style={{ padding: '20px' }}>
                <span className="badge badge-gold" style={{ marginBottom: '8px' }}>{item.category}</span>
                <h3 style={{ fontSize: '17px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '6px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
