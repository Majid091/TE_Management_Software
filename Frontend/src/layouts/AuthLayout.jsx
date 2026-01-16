import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Authentication layout for login/register pages
 */
const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <motion.div
          className="auth-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="auth-logo">
            <div className="logo-icon">TE</div>
            <h1 className="logo-text">TE Management</h1>
          </div>
          <Outlet />
        </motion.div>

        <div className="auth-background">
          <div className="auth-pattern"></div>
          <div className="auth-overlay"></div>
          <div className="auth-info">
            <h2>Company Management Software</h2>
            <p>Streamline your operations with our comprehensive management solution.</p>
            <ul className="auth-features">
              <li>Employee Management</li>
              <li>Project Tracking</li>
              <li>Revenue Analytics</li>
              <li>Department Organization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
