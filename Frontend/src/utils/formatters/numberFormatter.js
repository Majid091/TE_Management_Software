import APP_CONFIG from '../../config/app.config';

/**
 * Format a number as currency
 * @param {number} value - Number to format
 * @param {string} currency - Currency code (default from config)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = APP_CONFIG.currency.code) => {
  if (value === null || value === undefined || isNaN(value)) return '-';

  return new Intl.NumberFormat(APP_CONFIG.currency.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a number with thousand separators
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) return '-';

  return new Intl.NumberFormat(APP_CONFIG.currency.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a number as percentage
 * @param {number} value - Number to format (0-100 or 0-1)
 * @param {boolean} isDecimal - Whether value is in decimal form (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, isDecimal = false, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '-';

  const percentage = isDecimal ? value * 100 : value;

  return new Intl.NumberFormat(APP_CONFIG.currency.locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(percentage / 100);
};

/**
 * Format a large number in compact form (e.g., 1.2K, 3.4M)
 * @param {number} value - Number to format
 * @returns {string} Compact formatted number
 */
export const formatCompactNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '-';

  return new Intl.NumberFormat(APP_CONFIG.currency.locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

/**
 * Format bytes to human-readable size
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || isNaN(bytes)) return '-';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Round a number to specified decimal places
 * @param {number} value - Number to round
 * @param {number} decimals - Decimal places
 * @returns {number} Rounded number
 */
export const roundNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return 0;

  return Math.round((value + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Calculate percentage of a value
 * @param {number} value - The part value
 * @param {number} total - The total value
 * @returns {number} Percentage value
 */
export const calculatePercentage = (value, total) => {
  if (!total || isNaN(value) || isNaN(total)) return 0;

  return roundNumber((value / total) * 100, 1);
};
