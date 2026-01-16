import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Icon-only button component
 */
const IconButton = ({
  icon: Icon,
  size = 'medium',
  variant = 'ghost',
  disabled = false,
  className = '',
  label,
  onClick,
  ...props
}) => {
  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const classes = clsx(
    'btn-icon',
    `btn-icon-${size}`,
    `btn-icon-${variant}`,
    {
      'btn-disabled': disabled,
    },
    className
  );

  return (
    <motion.button
      type="button"
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      <Icon size={sizeMap[size]} />
    </motion.button>
  );
};

export default IconButton;
