import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import ImageInputPreview from '../../components/common/ImageInputPreview';

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: '4-Star Pilgrim Hotel',
    starRating: 4,
    location: 'Near Alipiri Gate, Tirupati',
    address: 'Near Alipiri Toll Gate, Tirupati - 517501',
    pricePerNight: 3200,
    originalPrice: 4200,
    vegOnly: true,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
    description: 'Clean, sanitized hotel close to temple routes with 24h hot water and pure satvic vegetarian food.',
    amenities: '100% Pure Vegetarian\n24h Hot Water\nTemple Shuttle\nFree High-Speed Wi-Fi',
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await adminService.getHotels();
      if (res?.data) {
        setHotels(res.data);
      }
    } catch (err) {
      console.warn('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      tagline: '',
      category: '4-Star Pilgrim Hotel',
      starRating: 4,
      location: 'Near Alipiri Gate, Tirupati',
      address: 'Near Alipiri Toll Gate, Tirupati - 517501',
      pricePerNight: 3200,
      originalPrice: 4200,
      vegOnly: true,
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
      description: 'Clean, sanitized hotel close to temple routes with 24h hot water and pure satvic vegetarian food.',
      amenities: '100% Pure Vegetarian\n24h Hot Water\nTemple Shuttle\nFree High-Speed Wi-Fi',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (h) => {
    setEditingHotel(h);
    setFormData({
      name: h.name || '',
      tagline: h.tagline || '',
      category: h.category || '',
      starRating: h.starRating || 4,
      location: h.location || '',
      address: h.address || '',
      pricePerNight: h.pricePerNight || 3000,
      originalPrice: h.originalPrice || 4000,
      vegOnly: !!h.vegOnly,
      featured: !!h.featured,
      thumbnail: h.thumbnail || '',
      description: h.description || '',
      amenities: Array.isArray(h.amenities) ? h.amenities.join('\n') : (h.amenities || ''),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this hotel listing?')) {
      try {
        await adminService.deleteHotel(id);
        toast.success('Hotel removed successfully');
        fetchHotels();
      } catch (err) {
        toast.error('Failed to remove hotel');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      thumbnail: formData.thumbnail,
      images: formData.thumbnail ? [formData.thumbnail] : [],
      amenities: formData.amenities.split('\n').filter(Boolean),
    };

    try {
      if (editingHotel) {
        await adminService.updateHotel(editingHotel.id || editingHotel.slug, payload);
        toast.success('Hotel updated successfully');
      } else {
        await adminService.createHotel(payload);
        toast.success('New Partner Hotel registered successfully!');
      }
      setShowModal(false);
      fetchHotels();
    } catch (err) {
      toast.error('Failed to save hotel');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🏨</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#4A0E1C', margin: 0, fontFamily: 'Cinzel, serif' }}>
              Hotels & Pilgrim Stays
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B615C', marginTop: '4px' }}>
            Manage pure vegetarian hotels, luxury pilgrim resorts, and hill cottages in Tirupati.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            padding: '9px 18px',
            fontSize: '13.5px',
            fontWeight: 700,
            borderRadius: '6px',
            border: 'none',
            background: 'linear-gradient(135deg, #4A0E1C 0%, #611626 100%)',
            color: '#F2DEA2',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>➕</span> Add Partner Hotel
        </button>
      </div>

      {/* Hotels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '20px' }}>
        {hotels.map((h) => (
          <div
            key={h.id || h.slug}
            style={{
              background: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E0D4C0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
              <img
                src={h.thumbnail}
                alt={h.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {h.vegOnly && (
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#2E7D46',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  🌱 100% Pure Veg
                </span>
              )}
              <span
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#F2DEA2',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                ★ {h.reviewRating || 4.8} ({h.reviewCount || 500}+)
              </span>
            </div>

            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#8C6B10', fontWeight: 700 }}>
                {h.category} • {'★'.repeat(h.starRating || 4)}
              </div>
              <h3 style={{ fontSize: '16px', color: '#4A0E1C', margin: '6px 0 4px', lineHeight: 1.3 }}>
                {h.name}
              </h3>
              <div style={{ fontSize: '12px', color: '#6B615C', marginBottom: '8px' }}>
                📍 {h.location}
              </div>
              <p style={{ fontSize: '12.5px', color: '#4A3F3A', margin: '0 0 12px', flex: 1 }}>
                {h.tagline || h.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingTop: '10px', borderTop: '1px dashed #EDE6D9' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#6B615C', textDecoration: 'line-through', marginRight: '6px' }}>
                    ₹{h.originalPrice}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#4A0E1C' }}>
                    ₹{h.pricePerNight}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B615C' }}> / night</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#2E7D46', fontWeight: 600 }}>
                  {h.rooms?.length || 2} Room Categories
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleOpenEdit(h)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '12.5px',
                    borderRadius: '6px',
                    border: '1px solid #D8CBB8',
                    background: '#FEFCF7',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(h.id || h.slug)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    borderRadius: '6px',
                    border: '1px solid #FDECEA',
                    background: '#FDECEA',
                    color: '#B3261E',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '12px', maxWidth: '600px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E0D4C0', paddingBottom: '14px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', color: '#4A0E1C', margin: 0 }}>
                {editingHotel ? '✏️ Edit Hotel Listing' : '➕ Register Partner Hotel'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B615C' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Hotel Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Star Rating
                  </label>
                  <select
                    value={formData.starRating}
                    onChange={(e) => setFormData({ ...formData, starRating: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  >
                    <option value={5}>5-Star Luxury</option>
                    <option value={4}>4-Star Premium</option>
                    <option value={3}>3-Star Deluxe</option>
                    <option value={2}>Budget Pilgrim Stay</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Price Per Night (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Location Area *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Alipiri Toll Gate, Tirupati"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>

              <ImageInputPreview
                label="Hotel Photo / Thumbnail"
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                helperText="Paste a direct image URL or upload an image file of the hotel property."
              />

              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600, color: '#2E7D46' }}>
                  <input
                    type="checkbox"
                    checked={formData.vegOnly}
                    onChange={(e) => setFormData({ ...formData, vegOnly: e.target.checked })}
                    style={{ accentColor: '#2E7D46', width: '16px', height: '16px' }}
                  />
                  100% Strictly Pure Vegetarian Hotel
                </label>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Key Amenities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D8CBB8', background: '#fff' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #4A0E1C 0%, #611626 100%)',
                  color: '#F2DEA2',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {editingHotel ? 'Update Hotel' : 'Save Partner Hotel'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminHotels;
