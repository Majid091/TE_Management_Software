import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

/**
 * Select component with label and error state
 * Supports both options array and children (option elements)
 */
const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      placeholder = 'Select an option',
      fullWidth = true,
      className = '',
      containerClassName = '',
      disabled = false,
      required = false,
      children,
      ...props
    },
    ref
  ) => {
    const selectClasses = clsx(
      'select',
      {
        'select-error': error,
        'select-disabled': disabled,
        'select-full-width': fullWidth,
      },
      className
    );

    return (
      <div className={clsx('select-container', containerClassName)}>
        {label && (
          <label className="select-label">
            {label}
            {required && <span className="select-required">*</span>}
          </label>
        )}

        <div className="select-wrapper">
          <select ref={ref} className={selectClasses} disabled={disabled} {...props}>
            {placeholder && <option value="">{placeholder}</option>}
            {/* Render children if provided, otherwise use options array */}
            {children ? children : options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="select-icon" />
        </div>

        {(error || helperText) && (
          <span className={clsx('select-helper', { 'select-error-text': error })}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
