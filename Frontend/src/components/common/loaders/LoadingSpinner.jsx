import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loading spinner component
 */
const LoadingSpinner = ({ size = 'medium', color = 'primary', text = '' }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white',
  };

  return (
    <div className="loading-spinner-container">
      <motion.div
        className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="spinner-circle"></div>
      </motion.div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
