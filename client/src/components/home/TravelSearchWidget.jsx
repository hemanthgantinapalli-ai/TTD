/**
 * TravelSearchWidget.jsx
 * Floating booking search widget — Packages | Hotels | Cars
 * Matches the reference design: white card, 18px radius, maroon active tab.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './TravelSearchWidget.module.css';

/* ── Icons ────────────────────────────────────────────────── */
const PackageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const HotelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/>
    <line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);

const CarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* ── Tab Definitions ─────────────────────────────────────── */
const TABS = [
  { id: 'packages', label: 'Packages', icon: <PackageIcon /> },
  { id: 'hotels',   label: 'Hotels',   icon: <HotelIcon /> },
  { id: 'cars',     label: 'Cars',     icon: <CarIcon /> },
];

/* ── Main Widget ─────────────────────────────────────────── */
const TravelSearchWidget = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('packages');

  /* Package form state */
  const [pkgDest,      setPkgDest]      = useState('');
  const [pkgDate,      setPkgDate]      = useState('');
  const [pkgTravellers,setPkgTravellers]= useState('1 Adult');
  const [pkgType,      setPkgType]      = useState('All Packages');

  /* Hotel form state */
  const [htlLocation, setHtlLocation]  = useState('');
  const [htlCheckin,  setHtlCheckin]   = useState('');
  const [htlCheckout, setHtlCheckout]  = useState('');
  const [htlGuests,   setHtlGuests]    = useState('1 Guest');

  /* Car form state */
  const [carPickup,   setCarPickup]    = useState('');
  const [carDate,     setCarDate]      = useState('');
  const [carTime,     setCarTime]      = useState('');
  const [carType,     setCarType]      = useState('All Cars');

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'packages') navigate(ROUTES.PACKAGES);
    else if (activeTab === 'hotels')   navigate(ROUTES.HOTELS);
    else                               navigate(ROUTES.CARS);
  };

  return (
    <div className={styles.widget} role="search" aria-label="Search travel options">

      {/* ── Tab header ─────────────────────────────────── */}
      <div className={styles.tabs} role="tablist" aria-label="Travel type">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Form area ─────────────────────────────────── */}
      <form className={styles.form} onSubmit={handleSearch} noValidate>

        {/* PACKAGES TAB */}
        {activeTab === 'packages' && (
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pkg-dest">
                <LocationIcon /> Destination
              </label>
              <select
                id="pkg-dest"
                className={styles.select}
                value={pkgDest}
                onChange={(e) => setPkgDest(e.target.value)}
              >
                <option value="">Select Destination</option>
                <option value="tirupati">Tirupati</option>
                <option value="tirumala">Tirumala</option>
                <option value="both">Tirupati + Tirumala</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="pkg-date">
                <CalendarIcon /> Travel Date
              </label>
              <input
                type="date"
                id="pkg-date"
                className={styles.input}
                value={pkgDate}
                onChange={(e) => setPkgDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                placeholder="Select Date"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="pkg-travellers">
                <UsersIcon /> No. of Travellers
              </label>
              <select
                id="pkg-travellers"
                className={styles.select}
                value={pkgTravellers}
                onChange={(e) => setPkgTravellers(e.target.value)}
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>2 Adults + 1 Child</option>
                <option>2 Adults + 2 Children</option>
                <option>Family (4+)</option>
                <option>Group (8+)</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="pkg-type">
                Package Type
              </label>
              <select
                id="pkg-type"
                className={styles.select}
                value={pkgType}
                onChange={(e) => setPkgType(e.target.value)}
              >
                <option>All Packages</option>
                <option>1 Day Darshan</option>
                <option>2 Day Package</option>
                <option>3 Day Package</option>
                <option>Family Tour</option>
                <option>VIP Darshan</option>
              </select>
            </div>
          </div>
        )}

        {/* HOTELS TAB */}
        {activeTab === 'hotels' && (
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="htl-location">
                <LocationIcon /> Location
              </label>
              <select
                id="htl-location"
                className={styles.select}
                value={htlLocation}
                onChange={(e) => setHtlLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                <option value="tirupati">Tirupati City</option>
                <option value="tirumala">Tirumala Hills</option>
                <option value="alipiri">Near Alipiri</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="htl-checkin">
                <CalendarIcon /> Check-in
              </label>
              <input
                type="date"
                id="htl-checkin"
                className={styles.input}
                value={htlCheckin}
                onChange={(e) => setHtlCheckin(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="htl-checkout">
                <CalendarIcon /> Check-out
              </label>
              <input
                type="date"
                id="htl-checkout"
                className={styles.input}
                value={htlCheckout}
                onChange={(e) => setHtlCheckout(e.target.value)}
                min={htlCheckin || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="htl-guests">
                <UsersIcon /> Guests
              </label>
              <select
                id="htl-guests"
                className={styles.select}
                value={htlGuests}
                onChange={(e) => setHtlGuests(e.target.value)}
              >
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>5+ Guests</option>
              </select>
            </div>
          </div>
        )}

        {/* CARS TAB */}
        {activeTab === 'cars' && (
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="car-pickup">
                <LocationIcon /> Pickup Location
              </label>
              <select
                id="car-pickup"
                className={styles.select}
                value={carPickup}
                onChange={(e) => setCarPickup(e.target.value)}
              >
                <option value="">Select Location</option>
                <option value="tirupati-station">Tirupati Railway Station</option>
                <option value="tirupati-airport">Renigunta Airport</option>
                <option value="tirupati-bus">Tirupati Bus Stand</option>
                <option value="alipiri">Alipiri</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="car-date">
                <CalendarIcon /> Travel Date
              </label>
              <input
                type="date"
                id="car-date"
                className={styles.input}
                value={carDate}
                onChange={(e) => setCarDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="car-time">
                <CalendarIcon /> Pickup Time
              </label>
              <input
                type="time"
                id="car-time"
                className={styles.input}
                value={carTime}
                onChange={(e) => setCarTime(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="car-type">
                Car Type
              </label>
              <select
                id="car-type"
                className={styles.select}
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
              >
                <option>All Cars</option>
                <option>Sedan (4+1)</option>
                <option>Innova (6+1)</option>
                <option>Tempo Traveller (12+1)</option>
              </select>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button type="submit" className={styles.searchBtn}>
          <SearchIcon />
          <span>
            {activeTab === 'packages' && 'Search Packages'}
            {activeTab === 'hotels'   && 'Search Hotels'}
            {activeTab === 'cars'     && 'Search Cars'}
          </span>
          <span className={styles.btnArrow}>→</span>
        </button>
      </form>
    </div>
  );
};

export default TravelSearchWidget;
