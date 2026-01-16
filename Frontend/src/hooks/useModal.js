import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * @param {boolean} initialState - Initial open state
 * @returns {object} Modal state and controls
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  /**
   * Open the modal
   * @param {*} modalData - Optional data to pass to the modal
   */
  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  /**
   * Close the modal
   */
  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data to allow for exit animations
    setTimeout(() => {
      setData(null);
    }, 300);
  }, []);

  /**
   * Toggle the modal
   */
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  };
};

export default useModal;
