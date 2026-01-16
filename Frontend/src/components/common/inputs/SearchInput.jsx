import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

/**
 * Search input component with clear button
 */
const SearchInput = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
  fullWidth = false,
  size = 'medium',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  const sizeClasses = {
    small: 'search-input-sm',
    medium: 'search-input-md',
    large: 'search-input-lg',
  };

  const containerClasses = clsx(
    'search-input-container',
    sizeClasses[size],
    {
      'search-input-focused': isFocused,
      'search-input-full-width': fullWidth,
      'search-input-disabled': disabled,
    },
    className
  );

  return (
    <div className={containerClasses}>
      <Search size={18} className="search-input-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value && (
        <button
          type="button"
          className="search-input-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
