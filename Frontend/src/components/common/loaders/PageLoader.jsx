import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Full page loading component
 */
const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="page-loader">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

export default PageLoader;
