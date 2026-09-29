import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav/MobileBottomNav';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
        <Outlet />
      </main>
      <Footer />
      <div className="mobile-nav-spacer" aria-hidden="true" />
      <MobileBottomNav />
    </>
  );
};

export default PublicLayout;
