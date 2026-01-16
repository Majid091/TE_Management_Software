/**
 * Form validation utilities
 */

/**
 * Check if a value is empty
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with strength score and messages
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    score: 0,
    messages: [],
  };

  if (!password) {
    result.messages.push('Password is required');
    return result;
  }

  if (password.length < 8) {
    result.messages.push('Password must be at least 8 characters');
  } else {
    result.score += 1;
  }

  if (!/[a-z]/.test(password)) {
    result.messages.push('Password must contain a lowercase letter');
  } else {
    result.score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    result.messages.push('Password must contain an uppercase letter');
  } else {
    result.score += 1;
  }

  if (!/\d/.test(password)) {
    result.messages.push('Password must contain a number');
  } else {
    result.score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.messages.push('Password should contain a special character');
  } else {
    result.score += 1;
  }

  result.isValid = result.score >= 4;
  return result;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {boolean}
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

/**
 * Validate minimum length
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum length
 * @returns {boolean}
 */
export const hasMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to check
 * @param {number} maxLength - Maximum length
 * @returns {boolean}
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Validate number range
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean}
 */
export const isInRange = (value, min, max) => {
  if (value === null || value === undefined) return false;
  return value >= min && value <= max;
};

/**
 * Validate positive number
 * @param {number} value - Value to check
 * @returns {boolean}
 */
export const isPositiveNumber = (value) => {
  if (value === null || value === undefined) return false;
  return typeof value === 'number' && value > 0;
};

/**
 * Create validation rules object
 * @param {object} rules - Validation rules
 * @returns {object} React Hook Form compatible rules
 */
export const createValidationRules = (rules) => {
  const validationRules = {};

  if (rules.required) {
    validationRules.required = rules.required === true ? 'This field is required' : rules.required;
  }

  if (rules.minLength) {
    validationRules.minLength = {
      value: rules.minLength,
      message: `Must be at least ${rules.minLength} characters`,
    };
  }

  if (rules.maxLength) {
    validationRules.maxLength = {
      value: rules.maxLength,
      message: `Must be no more than ${rules.maxLength} characters`,
    };
  }

  if (rules.min) {
    validationRules.min = {
      value: rules.min,
      message: `Must be at least ${rules.min}`,
    };
  }

  if (rules.max) {
    validationRules.max = {
      value: rules.max,
      message: `Must be no more than ${rules.max}`,
    };
  }

  if (rules.pattern) {
    validationRules.pattern = {
      value: rules.pattern,
      message: rules.patternMessage || 'Invalid format',
    };
  }

  if (rules.email) {
    validationRules.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email address',
    };
  }

  if (rules.validate) {
    validationRules.validate = rules.validate;
  }

  return validationRules;
};
