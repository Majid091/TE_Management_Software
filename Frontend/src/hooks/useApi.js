import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for making API calls with loading and error states
 * @param {Function} apiFunction - API function to call
 * @param {object} options - Options for the hook
 * @returns {object} API state and functions
 */
export const useApi = (apiFunction, options = {}) => {
  const { immediate = false, onSuccess, onError } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Execute the API call
   */
  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiFunction(...args);

        if (mountedRef.current) {
          setData(response);
          if (onSuccess) {
            onSuccess(response);
          }
        }

        return response;
      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
          setError(errorMessage);
          if (onError) {
            onError(err);
          }
        }
        throw err;
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [apiFunction, onSuccess, onError]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Execute immediately if option is set
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
};

export default useApi;
