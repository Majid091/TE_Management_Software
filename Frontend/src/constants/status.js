/**
 * Project status constants
 */
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * Project status labels
 */
export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PLANNING]: 'Planning',
  [PROJECT_STATUS.IN_PROGRESS]: 'In Progress',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.CANCELLED]: 'Cancelled',
};

/**
 * Project status colors
 */
export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.PLANNING]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  },
  [PROJECT_STATUS.IN_PROGRESS]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  [PROJECT_STATUS.ON_HOLD]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  [PROJECT_STATUS.COMPLETED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  [PROJECT_STATUS.CANCELLED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
};

/**
 * Employee availability status
 */
export const EMPLOYEE_AVAILABILITY = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  ON_LEAVE: 'on_leave',
  UNAVAILABLE: 'unavailable',
};

/**
 * Employee availability labels
 */
export const EMPLOYEE_AVAILABILITY_LABELS = {
  [EMPLOYEE_AVAILABILITY.AVAILABLE]: 'Available',
  [EMPLOYEE_AVAILABILITY.BUSY]: 'Busy',
  [EMPLOYEE_AVAILABILITY.ON_LEAVE]: 'On Leave',
  [EMPLOYEE_AVAILABILITY.UNAVAILABLE]: 'Unavailable',
};

/**
 * Employee availability colors
 */
export const EMPLOYEE_AVAILABILITY_COLORS = {
  [EMPLOYEE_AVAILABILITY.AVAILABLE]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  [EMPLOYEE_AVAILABILITY.BUSY]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500',
  },
  [EMPLOYEE_AVAILABILITY.ON_LEAVE]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  [EMPLOYEE_AVAILABILITY.UNAVAILABLE]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
};
