import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/header/Header';
import Sidebar from '../components/layout/sidebar/Sidebar';
import { useApp } from '../hooks/useApp';

/**
 * Main application layout with sidebar and header
 */
const MainLayout = () => {
  const { state, toggleSidebar } = useApp();
  const { sidebarCollapsed } = state.ui;
  const location = useLocation();

  // Mobile sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      toggleSidebar();
    }
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="main-layout">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleMobileMenuClose}
          />
        )}
      </AnimatePresence>

      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleMenuToggle}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
        isMobile={isMobile}
      />

      <div
        className={`main-content ${sidebarCollapsed && !isMobile ? 'sidebar-collapsed' : ''}`}
      >
        <Header onMenuToggle={handleMenuToggle} />

        <main className="page-content">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
