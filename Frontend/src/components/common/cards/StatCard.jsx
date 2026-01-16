import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

/**
 * Statistics card component for dashboard
 */
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  className = '',
}) => {
  const colorClasses = {
    primary: 'stat-card-primary',
    secondary: 'stat-card-secondary',
    success: 'stat-card-success',
    warning: 'stat-card-warning',
    danger: 'stat-card-danger',
    info: 'stat-card-info',
  };

  const isTrendPositive = trend === 'up';

  return (
    <motion.div
      className={clsx('stat-card', colorClasses[color], className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <div className="stat-card-header">
        <div className="stat-card-icon">
          {Icon && <Icon size={24} />}
        </div>
        {trend && (
          <div className={clsx('stat-card-trend', isTrendPositive ? 'trend-up' : 'trend-down')}>
            {isTrendPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="stat-card-body">
        <motion.h3
          className="stat-card-value"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {value}
        </motion.h3>
        <p className="stat-card-title">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
