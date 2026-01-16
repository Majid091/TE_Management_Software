import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

/**
 * Reusable button component with variants and animations
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon: Icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'btn';

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg',
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    {
      'btn-disabled': disabled || loading,
      'btn-loading': loading,
      'btn-full-width': fullWidth,
      'btn-icon-only': !children && Icon,
    },
    className
  );

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={size === 'small' ? 14 : size === 'large' ? 18 : 16} className="btn-spinner" />
          {children && <span className="btn-text">{children}</span>}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'small' ? 14 : size === 'large' ? 18 : 16} className="btn-icon" />}
          {children && <span className="btn-text">{children}</span>}
          {Icon && iconPosition === 'right' && <Icon size={size === 'small' ? 14 : size === 'large' ? 18 : 16} className="btn-icon" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
