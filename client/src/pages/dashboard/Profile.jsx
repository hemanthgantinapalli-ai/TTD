import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateUser } from '../../redux/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || 'Venkatesh Prasad',
    email: user?.email || 'venkatesh@gmail.com',
    phone: user?.phone || '+91 98765 43210',
    city: user?.city || 'Bengaluru, Karnataka',
    idType: 'Aadhaar Card',
    idNumber: '•••• •••• 9821',
  });

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateUser(formData));
    toast.success('Profile details updated successfully!');
  };

  return (
    <div className="card" style={{ padding: '32px' }}>
      <span className="eyebrow">Personal Information</span>
      <h1 style={{ fontSize: '24px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '24px' }}>
        Devotee Profile
      </h1>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
            Full Name (as per Govt ID)
          </label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
              Mobile Number
            </label>
            <input
              type="text"
              className="input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
            City / State
          </label>
          <input
            type="text"
            className="input"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
              Saved ID Proof Type
            </label>
            <select
              className="input"
              value={formData.idType}
              onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
            >
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="Passport">Passport</option>
              <option value="Voter ID">Voter ID</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-700)', display: 'block', marginBottom: '6px' }}>
              ID Number (Masked)
            </label>
            <input
              type="text"
              className="input"
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-gold btn-lg" style={{ marginTop: '12px' }}>
          Save Profile Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
