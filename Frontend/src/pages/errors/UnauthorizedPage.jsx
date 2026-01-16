import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, ShieldX } from 'lucide-react';
import { Button } from '../../components/common';

/**
 * 403 Unauthorized page
 */
const UnauthorizedPage = () => {
  return (
    <motion.div
      className="error-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="error-icon danger"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        <ShieldX size={48} />
      </motion.div>

      <motion.div
        className="error-code"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        403
      </motion.div>

      <motion.h1
        className="error-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Access Denied
      </motion.h1>

      <motion.p
        className="error-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        You don't have permission to access this page.
        Please contact your administrator if you believe this is an error.
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

export default UnauthorizedPage;
