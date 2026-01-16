import React, { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Input component with label and error state
 */
const Input = forwardRef(
  (
    {
      type = 'text',
      label,
      error,
      helperText,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = true,
      className = '',
      containerClassName = '',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputClasses = clsx(
      'input',
      {
        'input-error': error,
        'input-with-icon': Icon,
        'input-icon-left': Icon && iconPosition === 'left',
        'input-icon-right': Icon && iconPosition === 'right',
        'input-disabled': disabled,
        'input-full-width': fullWidth,
      },
      className
    );

    return (
      <div className={clsx('input-container', containerClassName)}>
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}

        <div className="input-wrapper">
          {Icon && iconPosition === 'left' && (
            <Icon size={18} className="input-icon" />
          )}

          <input
            ref={ref}
            type={type}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />

          {Icon && iconPosition === 'right' && (
            <Icon size={18} className="input-icon" />
          )}
        </div>

        {(error || helperText) && (
          <span className={clsx('input-helper', { 'input-error-text': error })}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
