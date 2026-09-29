import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import BookingLayout from './BookingLayout';
import { setTravellers } from '../../redux/slices/bookingSlice';
import { ROUTES } from '../../constants/routes';
import styles from './Booking.module.css';

const TravellerDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBooking, travellers } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  const [lead, setLead] = useState(
    travellers.lead || {
      name: user?.name || '',
      phone: user?.phone?.replace('+91 ', '') || '',
      email: user?.email || '',
      age: '',
      gender: 'Male',
      idType: 'Aadhaar',
      idNumber: '',
      elderAssistance: false,
    }
  );

  const [coTravellers, setCoTravellers] = useState(travellers.coTravellers || []);

  const addTraveller = () => {
    setCoTravellers([
      ...coTravellers,
      { name: '', age: '', gender: 'Male', idType: 'Aadhaar', idNumber: '' },
    ]);
  };

  const removeTraveller = (idx) => {
    setCoTravellers(coTravellers.filter((_, i) => i !== idx));
  };

  const updateCoTraveller = (idx, field, value) => {
    const updated = [...coTravellers];
    updated[idx][field] = value;
    setCoTravellers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lead.name || !lead.phone || !lead.age) {
      toast.error('Please complete lead devotee name, age, and phone number');
      return;
    }

    dispatch(setTravellers({ lead, coTravellers }));
    navigate(ROUTES.SELECT_DATE);
  };

  return (
    <BookingLayout currentStep={1}>
      <div className={styles.bookingGrid}>
        {/* Main Devotee Form */}
        <div className={styles.formCard}>
          <div style={{ marginBottom: '24px' }}>
            <span className="badge badge-maroon">Step 1 of 5</span>
            <h2 style={{ fontSize: '22px', color: 'var(--color-maroon-900)', marginTop: '6px' }}>
              Lead Devotee & Pilgrim Details
            </h2>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              Ensure names match the official ID proof carried during the journey for TTD verification.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Primary Devotee Card */}
            <div className={styles.travellerCard}>
              <div className={styles.travellerHeader}>
                <strong style={{ fontSize: '15px', color: 'var(--color-maroon-900)' }}>
                  👤 Primary Contact / Lead Devotee
                </strong>
                <span className="badge badge-gold">Primary</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="formLabel" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Full Name (As on ID) *
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. K. Venkatesh Rao"
                    required
                    value={lead.name}
                    onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="formLabel" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="10-digit mobile"
                    required
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="formLabel" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Age *
                  </label>
                  <input
                    type="number"
                    className="input"
                    placeholder="Age"
                    min="1"
                    max="110"
                    required
                    value={lead.age}
                    onChange={(e) => setLead({ ...lead, age: e.target.value })}
                  />
                </div>

                <div>
                  <label className="formLabel" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Gender *
                  </label>
                  <select
                    className="input"
                    value={lead.gender}
                    onChange={(e) => setLead({ ...lead, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="formLabel" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    ID Proof Type
                  </label>
                  <select
                    className="input"
                    value={lead.idType}
                    onChange={(e) => setLead({ ...lead, idType: e.target.value })}
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="VoterID">Voter ID</option>
                    <option value="DrivingLicence">Driving Licence</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-maroon-900)', fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={lead.elderAssistance}
                    onChange={(e) => setLead({ ...lead, elderAssistance: e.target.checked })}
                    style={{ accentColor: 'var(--color-maroon-900)', width: '16px', height: '16px' }}
                  />
                  <span>👵 Request Senior Citizen / Wheelchair Ground Assistance</span>
                </label>
              </div>
            </div>

            {/* Co-Travellers List */}
            {coTravellers.map((traveller, index) => (
              <div key={index} className={styles.travellerCard}>
                <div className={styles.travellerHeader}>
                  <strong style={{ fontSize: '14px', color: 'var(--color-maroon-900)' }}>
                    Pilgrim {index + 2}
                  </strong>
                  <button
                    type="button"
                    onClick={() => removeTraveller(index)}
                    style={{ color: 'var(--color-error)', fontSize: '12px', fontWeight: 600 }}
                  >
                    ✕ Remove
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="formLabel" style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>Name</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Full Name"
                      value={traveller.name}
                      onChange={(e) => updateCoTraveller(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="formLabel" style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>Age</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="Age"
                      value={traveller.age}
                      onChange={(e) => updateCoTraveller(index, 'age', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="formLabel" style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>Gender</label>
                    <select
                      className="input"
                      value={traveller.gender}
                      onChange={(e) => updateCoTraveller(index, 'gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTraveller}
              className="btn btn-outline btn-sm"
              style={{ marginBottom: '24px' }}
            >
              + Add Co-Traveller
            </button>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button type="submit" className="btn btn-gold btn-lg">
                Proceed to Select Date & Slot →
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className={styles.sidebarSummary}>
          <span className="eyebrow">Booking Summary</span>
          <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginTop: '4px', marginBottom: '12px' }}>
            {currentBooking.itemData?.name || currentBooking.itemData?.title || 'Selected Pilgrimage Option'}
          </h3>

          <div style={{ background: 'var(--color-sandal-100)', padding: '14px', borderRadius: '8px', fontSize: '13px', color: 'var(--color-neutral-800)', marginBottom: '16px' }}>
            <div>📌 <strong>Type:</strong> {currentBooking.type?.toUpperCase() || 'CUSTOM'}</div>
            <div style={{ marginTop: '4px' }}>🛡️ <strong>Cancellation:</strong> 100% Free up to 24 hrs</div>
            <div style={{ marginTop: '4px' }}>📞 <strong>Support:</strong> 24/7 Tirupati Desk Coordinator</div>
          </div>
        </div>
      </div>
    </BookingLayout>
  );
};

export default TravellerDetails;
