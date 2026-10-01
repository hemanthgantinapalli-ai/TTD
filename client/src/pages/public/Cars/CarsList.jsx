import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars } from '../../../redux/slices/carSlice';
import { ROUTES } from '../../../constants/routes';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import styles from './Cars.module.css';

const CarsList = () => {
  const dispatch = useDispatch();
  const { cars, isLoading } = useSelector((state) => state.car);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const filteredCars = (cars || []).filter((car) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'sedan') return car.category.toLowerCase().includes('sedan');
    if (selectedCategory === 'suv') return car.category.toLowerCase().includes('suv') || car.category.toLowerCase().includes('muv');
    if (selectedCategory === 'tempo') return car.category.toLowerCase().includes('mini-bus') || car.category.toLowerCase().includes('tempo');
    return true;
  });

  if (isLoading && cars.length === 0) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="skeleton" style={{ width: '200px', height: '24px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="cars-page">
      <PageHeader
        eyebrow="TEMPLE TRAVEL & LOCAL TRANSPORT"
        title="CARS & CAB SERVICES"
        subtitle="Comfortable AC transportation for Tirupati and surrounding temple visits."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Cars' },
        ]}
      />

      <div className="container section">
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {[
            { id: 'all', label: 'All Vehicles' },
            { id: 'suv', label: 'SUV & Innova (6-7 Seater)' },
            { id: 'sedan', label: 'Sedans (Dzire/Etios)' },
            { id: 'tempo', label: 'Tempo Travellers (12+ Seater)' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-maroon' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.carGrid}>
          {filteredCars.map((car) => (
            <div key={car.id} className={styles.carCard}>
              <div style={{ position: 'relative' }}>
                <img src={car.thumbnail} alt={car.name} className={styles.carImg} loading="lazy" />
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge badge-gold">{car.category}</span>
                </div>
              </div>

              <div className={styles.carBody}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '18px', color: 'var(--color-maroon-900)' }}>{car.name}</h2>
                  <span style={{ color: 'var(--color-gold-700)', fontWeight: 600, fontSize: '13px' }}>
                    ★ {car.rating}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {car.description}
                </p>

                <div className={styles.carSpecGrid}>
                  <div className={styles.specItem}>👥 {car.capacity}</div>
                  <div className={styles.specItem}>🧳 {car.luggage}</div>
                  <div className={styles.specItem}>❄️ Dual AC Included</div>
                  <div className={styles.specItem}>⛽ {car.fuelType}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textTransform: 'uppercase' }}>
                      Daily Rate
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="price">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/ day</span>
                    </div>
                  </div>

                  <Link to={ROUTES.CAR_DETAIL(car.slug)} className="btn btn-gold btn-sm">
                    View & Book →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarsList;
