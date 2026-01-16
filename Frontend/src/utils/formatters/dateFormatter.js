import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';
import APP_CONFIG from '../../config/app.config';

/**
 * Format a date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Optional format string
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = APP_CONFIG.dateFormats.display) => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '-';

  return format(dateObj, formatStr);
};

/**
 * Format a date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string with time
 */
export const formatDateTime = (date) => {
  return formatDate(date, APP_CONFIG.dateFormats.displayWithTime);
};

/**
 * Format a date for input fields
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string for inputs
 */
export const formatDateForInput = (date) => {
  return formatDate(date, APP_CONFIG.dateFormats.input);
};

/**
 * Get relative time from now
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '-';

  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Get relative date
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative date string
 */
export const getRelativeDate = (date) => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '-';

  return formatRelative(dateObj, new Date());
};

/**
 * Parse an ISO date string
 * @param {string} dateStr - ISO date string
 * @returns {Date|null} Parsed date or null
 */
export const parseDate = (dateStr) => {
  if (!dateStr) return null;

  const date = parseISO(dateStr);
  return isValid(date) ? date : null;
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  if (!date) return false;

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) && dateObj < new Date();
};

/**
 * Check if a date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  if (!date) return false;

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) && dateObj > new Date();
};
