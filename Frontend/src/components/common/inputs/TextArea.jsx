import React, { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * TextArea component with label and error state
 */
const TextArea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      className = '',
      containerClassName = '',
      disabled = false,
      required = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaClasses = clsx(
      'textarea',
      {
        'textarea-error': error,
        'textarea-disabled': disabled,
        'textarea-full-width': fullWidth,
      },
      className
    );

    return (
      <div className={clsx('textarea-container', containerClassName)}>
        {label && (
          <label className="textarea-label">
            {label}
            {required && <span className="textarea-required">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          rows={rows}
          {...props}
        />

        {(error || helperText) && (
          <span className={clsx('textarea-helper', { 'textarea-error-text': error })}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
