import React from 'react';
import clsx from 'clsx';

/**
 * Form field wrapper component
 */
const FormField = ({ children, className = '' }) => {
  return <div className={clsx('form-field', className)}>{children}</div>;
};

/**
 * Form row for horizontal layout
 */
export const FormRow = ({ children, className = '' }) => {
  return <div className={clsx('form-row', className)}>{children}</div>;
};

/**
 * Form section with title
 */
export const FormSection = ({ title, description, children, className = '' }) => {
  return (
    <div className={clsx('form-section', className)}>
      {(title || description) && (
        <div className="form-section-header">
          {title && <h3 className="form-section-title">{title}</h3>}
          {description && <p className="form-section-description">{description}</p>}
        </div>
      )}
      <div className="form-section-content">{children}</div>
    </div>
  );
};

/**
 * Form actions container
 */
export const FormActions = ({ children, align = 'right', className = '' }) => {
  return (
    <div className={clsx('form-actions', `form-actions-${align}`, className)}>
      {children}
    </div>
  );
};

export default FormField;
