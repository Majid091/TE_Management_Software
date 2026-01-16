import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

/**
 * Alert component for displaying messages
 */
const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  closable = true,
  className = '',
}) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <motion.div
      className={clsx('alert', `alert-${type}`, className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="alert-icon">
        <Icon size={20} />
      </div>
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        {message && <p className="alert-message">{message}</p>}
      </div>
      {closable && onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close alert">
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default Alert;
