import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../../components/common';

/**
 * 404 Not Found page
 */
const NotFoundPage = () => {
  return (
    <motion.div
      className="error-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="error-icon warning"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        <Search size={48} />
      </motion.div>

      <motion.div
        className="error-code"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        404
      </motion.div>

      <motion.h1
        className="error-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Page Not Found
      </motion.h1>

      <motion.p
        className="error-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        The page you're looking for doesn't exist or has been moved.
        Please check the URL or navigate back to the dashboard.
      </motion.p>

      <motion.div
        className="error-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ display: 'flex', gap: '1rem' }}
      >
        <Button
          variant="outline"
          icon={ArrowLeft}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        <Link to="/dashboard">
          <Button variant="primary" icon={Home}>
            Go to Dashboard
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;
