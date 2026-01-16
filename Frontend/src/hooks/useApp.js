import { useContext } from 'react';
import { AppContext } from '../state/AppContext';

/**
 * Custom hook to access application context
 * @returns {object} App context value
 */
export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};

export default useApp;
