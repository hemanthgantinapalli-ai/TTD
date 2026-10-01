import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import ImageInputPreview from '../../components/common/ImageInputPreview';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Premium SUV / MUV',
    capacity: '6+1 Devotees',
    luggage: '4 Large Bags',
    fuelType: 'Diesel',
    ac: true,
    pricePerDay: 3600,
    perKmRate: 16,
    minKmPerDay: 250,
    airportPickupTirupati: 900,
    thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: 'Gold standard for family pilgrimage travel on winding Tirumala ghat roads.',
    features: 'Ghat Road Certified Experienced Driver\nDual AC with Climate Control\nDevotional Audio Playlist\nComplimentary Mineral Water',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCars();
      if (res?.data) {
        setCars(res.data);
      }
    } catch (err) {
      console.warn('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCar(null);
    setFormData({
      name: '',
      category: 'Premium SUV / MUV',
      capacity: '6+1 Devotees',
      luggage: '4 Large Bags',
      fuelType: 'Diesel',
      ac: true,
      pricePerDay: 3600,
      perKmRate: 16,
      minKmPerDay: 250,
      airportPickupTirupati: 900,
      thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      description: 'Gold standard for family pilgrimage travel on winding Tirumala ghat roads.',
      features: 'Ghat Road Certified Experienced Driver\nDual AC with Climate Control\nDevotional Audio Playlist\nComplimentary Mineral Water',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCar(c);
    setFormData({
      name: c.name || '',
      category: c.category || '',
      capacity: c.capacity || '',
      luggage: c.luggage || '',
      fuelType: c.fuelType || 'Diesel',
      ac: !!c.ac,
      pricePerDay: c.pricePerDay || 3000,
      perKmRate: c.perKmRate || 15,
      minKmPerDay: c.minKmPerDay || 250,
      airportPickupTirupati: c.airportPickupTirupati || 800,
      thumbnail: c.thumbnail || '',
      description: c.description || '',
      features: Array.isArray(c.features) ? c.features.join('\n') : (c.features || ''),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this vehicle from fleet?')) {
      try {
        await adminService.deleteCar(id);
        toast.success('Vehicle removed from fleet');
        fetchCars();
      } catch (err) {
        toast.error('Failed to remove vehicle');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      thumbnail: formData.thumbnail,
      image: formData.thumbnail,
      features: formData.features.split('\n').filter(Boolean),
    };

    try {
      if (editingCar) {
        await adminService.updateCar(editingCar.id || editingCar.slug, payload);
        toast.success('Vehicle details updated');
      } else {
        await adminService.createCar(payload);
        toast.success('New vehicle added to fleet successfully!');
      }
      setShowModal(false);
      fetchCars();
    } catch (err) {
      toast.error('Failed to save car');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🚗</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#4A0E1C', margin: 0, fontFamily: 'Cinzel, serif' }}>
              Hill Fleet & Cab Operations
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B615C', marginTop: '4px' }}>
            Manage hill-certified AC cabs, tempo travellers, SUVs, and dedicated devotional chauffeurs.
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
          <span>➕</span> Add Vehicle to Fleet
        </button>
      </div>

      {/* Fleet Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '20px' }}>
        {cars.map((c) => (
          <div
            key={c.id || c.slug}
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
                src={c.thumbnail}
                alt={c.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: '#320710',
                  color: '#F2DEA2',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                {c.category}
              </span>
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
                👥 {c.capacity}
              </span>
            </div>

            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '16px', color: '#4A0E1C', margin: '0 0 6px', lineHeight: 1.3 }}>
                {c.name}
              </h3>
              <p style={{ fontSize: '12.5px', color: '#4A3F3A', margin: '0 0 12px', flex: 1 }}>
                {c.description}
              </p>

              <div style={{ background: '#FAF0F2', padding: '10px', borderRadius: '6px', fontSize: '12px', color: '#4A0E1C', marginBottom: '12px' }}>
                <div>🧳 <strong>Luggage:</strong> {c.luggage}</div>
                <div>⛽ <strong>Fuel / AC:</strong> {c.fuelType} • {c.ac ? 'Full AC' : 'Non-AC'}</div>
                <div>📍 <strong>Tirupati Airport Pickup:</strong> ₹{c.airportPickupTirupati || 800}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingTop: '10px', borderTop: '1px dashed #EDE6D9' }}>
                <div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#4A0E1C' }}>
                    ₹{c.pricePerDay}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B615C' }}> / day</span>
                </div>
                <div style={{ fontSize: '12px', color: '#8C6B10', fontWeight: 600 }}>
                  ₹{c.perKmRate}/km (Min {c.minKmPerDay} km)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleOpenEdit(c)}
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
                  onClick={() => handleDelete(c.id || c.slug)}
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
                {editingCar ? '✏️ Edit Vehicle' : '➕ Register Fleet Vehicle'}
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
                  Vehicle Model Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Innova Crysta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Seating Capacity
                  </label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Daily Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Per KM Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.perKmRate}
                    onChange={(e) => setFormData({ ...formData, perKmRate: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Luggage Capacity
                  </label>
                  <input
                    type="text"
                    value={formData.luggage}
                    onChange={(e) => setFormData({ ...formData, luggage: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                    Airport Pickup Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.airportPickupTirupati}
                    onChange={(e) => setFormData({ ...formData, airportPickupTirupati: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #D8CBB8', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <ImageInputPreview
                  label="Vehicle Photo / Thumbnail"
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                  helperText="Paste vehicle image URL or upload file directly."
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A3F3A', display: 'block', marginBottom: '4px' }}>
                  Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
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
                {editingCar ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCars;
