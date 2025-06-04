import { useState, useCallback } from 'react';

const useRefresh = (refetchFunctions: Array<() => Promise<any>>) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(refetchFunctions.map(fn => fn()));
    } catch (error) {
      console.error('Refresh error:', error);
      throw error; // Re-throw if you want to handle errors in the component
    } finally {
      setRefreshing(false);
    }
  }, [refetchFunctions]);

  return {
    refreshing,
    handleRefresh,
    setRefreshing, // Optional - in case you need manual control
  };
};

export default useRefresh;