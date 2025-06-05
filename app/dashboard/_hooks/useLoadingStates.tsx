import { useState, useEffect } from 'react';

interface UseLoadingStatesParams {
  userStatsLoading?: boolean;
  courseStatsLoading?: boolean;
  authLoading?: boolean;
}

export function useLoadingStates({
  userStatsLoading = false,
  courseStatsLoading = false,
  authLoading = false
}: UseLoadingStatesParams) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    // Mostrar skeleton mientras cualquier dato esté cargando
    const isLoading = userStatsLoading || courseStatsLoading || authLoading;
    setShowSkeleton(isLoading);
  }, [userStatsLoading, courseStatsLoading, authLoading]);

  return {
    showSkeleton,
    isAnyLoading: userStatsLoading || courseStatsLoading || authLoading
  };
}