import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav/MobileBottomNav';
import DevotionalMusicFab from '../components/common/DevotionalMusicFab/DevotionalMusicFab';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      {/* Solid header offset for all pages */}
      <main
        id="main-content"
        className="flex-1"
        style={{
          minHeight: 'calc(100vh - var(--header-height, 78px))',
          paddingTop: 'var(--header-height, 78px)',
        }}
      >
        <Outlet />
      </main>
      <Footer />
      {/* Floating devotional music ॐ button */}
      <DevotionalMusicFab />
      <div className="mobile-nav-spacer" aria-hidden="true" />
      <MobileBottomNav />
    </>
  );
};

export default PublicLayout;
