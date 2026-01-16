import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Card component for content containers
 */
const Card = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  hoverable = false,
  onClick,
  ...props
}) => {
  const paddingClasses = {
    none: 'card-p-none',
    small: 'card-p-sm',
    medium: 'card-p-md',
    large: 'card-p-lg',
  };

  const shadowClasses = {
    none: 'card-shadow-none',
    small: 'card-shadow-sm',
    medium: 'card-shadow-md',
    large: 'card-shadow-lg',
  };

  const classes = clsx(
    'card',
    paddingClasses[padding],
    shadowClasses[shadow],
    {
      'card-hoverable': hoverable,
      'card-clickable': !!onClick,
    },
    className
  );

  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick
    ? {
        whileHover: { y: -4 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component className={classes} onClick={onClick} {...motionProps} {...props}>
      {children}
    </Component>
  );
};

/**
 * Card Header subcomponent
 */
export const CardHeader = ({ children, className = '', actions }) => {
  return (
    <div className={clsx('card-header', className)}>
      <div className="card-header-content">{children}</div>
      {actions && <div className="card-header-actions">{actions}</div>}
    </div>
  );
};

/**
 * Card Title subcomponent
 */
export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={clsx('card-title', className)}>{children}</h3>;
};

/**
 * Card Description subcomponent
 */
export const CardDescription = ({ children, className = '' }) => {
  return <p className={clsx('card-description', className)}>{children}</p>;
};

/**
 * Card Body subcomponent
 */
export const CardBody = ({ children, className = '' }) => {
  return <div className={clsx('card-body', className)}>{children}</div>;
};

/**
 * Card Footer subcomponent
 */
export const CardFooter = ({ children, className = '' }) => {
  return <div className={clsx('card-footer', className)}>{children}</div>;
};

export default Card;
