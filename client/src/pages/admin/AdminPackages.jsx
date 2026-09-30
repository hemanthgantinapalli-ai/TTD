import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: '1-Day Express',
    duration: '1 Day / Same Day Return',
    startingPrice: 2499,
    originalPrice: 3499,
    badge: 'Popular',
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    highlights: 'AC Cab Pickup & Ghat road transit\nGuided darshan assistance\nPadmavathi Temple visit\nSrivari Laddu Prasadam help',
    inclusions: 'Dedicated AC Vehicle & Hill driver\nTirumala Ghat Toll & Parking\n24/7 Pilgrim Support',
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPackages();
      if (res?.data) {
        setPackages(res.data);
      }
    } catch (err) {
      console.warn('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setFormData({
      title: '',
      tagline: '',
      category: '1-Day Express',
      duration: '1 Day / Same Day Return',
      startingPrice: 2499,
      originalPrice: 3499,
      badge: 'Popular',
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      highlights: 'AC Cab Pickup & Ghat road transit\nGuided darshan assistance\nPadmavathi Temple visit\nSrivari Laddu Prasadam help',
      inclusions: 'Dedicated AC Vehicle & Hill driver\nTirumala Ghat Toll & Parking\n24/7 Pilgrim Support',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPkg(pkg);
    setFormData({
      title: pkg.title || '',
      tagline: pkg.tagline || '',
      category: pkg.category || '1-Day Express',
      duration: pkg.duration || '',
      startingPrice: pkg.startingPrice || 0,
      originalPrice: pkg.originalPrice || 0,
      badge: pkg.badge || '',
      featured: !!pkg.featured,
      thumbnail: pkg.thumbnail || '',
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : (pkg.highlights || ''),
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : (pkg.inclusions || ''),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this yatra package?')) {
      try {
        await adminService.deletePackage(id);
        toast.success('Package deleted successfully');
        fetchPackages();
      } catch (err) {
        toast.error('Failed to delete package');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      highlights: formData.highlights.split('\n').filter(Boolean),
      inclusions: formData.inclusions.split('\n').filter(Boolean),
    };

    try {
      if (editingPkg) {
        await adminService.updatePackage(editingPkg.id || editingPkg.slug, payload);
        toast.success('Package updated successfully');
      } else {
        await adminService.createPackage(payload);
        toast.success('New Yatra Package published successfully!');
      }
      setShowModal(false);
      fetchPackages();
    } catch (err) {
      toast.error('Failed to save package');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📦</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#4A0E1C', margin: 0, fontFamily: 'Cinzel, serif' }}>
              Yatra Packages Catalog
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B615C', marginTop: '4px' }}>
            Create and edit VIP break darshan packages, circuit yatras, and senior citizen tours.
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
          <span>➕</span> Add New Package
        </button>
      </div>

      {/* Packages Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '20px' }}>
        {packages.map((pkg) => (
          <div
            key={pkg.id || pkg.slug}
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
                src={pkg.thumbnail}
                alt={pkg.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {pkg.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#C9A227',
                    color: '#320710',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {pkg.badge}
                </span>
              )}
              <span
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                ⏱️ {pkg.duration}
              </span>
            </div>

            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#8C6B10', fontWeight: 700 }}>
                {pkg.category}
              </div>
              <h3 style={{ fontSize: '16px', color: '#4A0E1C', margin: '6px 0 8px', lineHeight: 1.3 }}>
                {pkg.title}
              </h3>
              <p style={{ fontSize: '12.5px', color: '#6B615C', margin: '0 0 12px', flex: 1 }}>
                {pkg.tagline}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingTop: '10px', borderTop: '1px dashed #EDE6D9' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#6B615C', textDecoration: 'line-through', marginRight: '6px' }}>
                    ₹{pkg.originalPrice}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#4A0E1C' }}>
                    ₹{pkg.startingPrice}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B615C' }}> / devotee</span>
                </div>
                <div style={{ fontSize: '12px', color: '#C96412', fontWeight: 700 }}>
                  ★ {pkg.rating || 4.9} ({pkg.reviewCount || 100})
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleOpenEdit(pkg)}
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
                  onClick={() => handleDelete(pkg.id || pkg.slug)}
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
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '12px', maxWidth: '640px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E0D4C0', paddingBottom: '14px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', color: '#4A0E1C', margin: 0 }}>
                {editingPkg ? '✏️ Edit Yatra Package' : '➕ Create New Yatra Package'}
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
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Tagline / Brief Summary
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
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  >
                    <option value="1-Day Express">1-Day Express</option>
                    <option value="2 Days / 1 Night">2 Days / 1 Night</option>
                    <option value="Special Care">Special Care (Elders/Wheelchair)</option>
                    <option value="VIP Break Darshan">VIP Break Darshan</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Duration Text
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Starting Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Badge (e.g. Most Popular)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Thumbnail Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Highlights (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Inclusions (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.inclusions}
                  onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
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
                {editingPkg ? 'Update Package' : 'Publish Package'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
