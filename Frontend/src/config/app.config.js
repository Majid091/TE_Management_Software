/**
 * Application Configuration
 */
export const APP_CONFIG = {
  // Application Info
  name: 'TE Management Software',
  version: '1.0.0',
  description: 'Company Management Solution',

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    timeout: 30000,
  },

  // Authentication
  auth: {
    tokenKey: 'te_auth_token',
    refreshTokenKey: 'te_refresh_token',
    userKey: 'te_user',
    tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes before expiry
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },

  // Date/Time Formats
  dateFormats: {
    display: 'MMM dd, yyyy',
    displayWithTime: 'MMM dd, yyyy HH:mm',
    input: 'yyyy-MM-dd',
    api: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  },

  // Currency
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
  },

  // UI Configuration
  ui: {
    sidebarWidth: 256,
    sidebarCollapsedWidth: 64,
    headerHeight: 64,
    toastDuration: 4000,
  },

  // Feature Flags
  features: {
    enableDarkMode: true,
    enableNotifications: true,
    enableAnalytics: true,
    enableReports: true,
  },
};

export default APP_CONFIG;
