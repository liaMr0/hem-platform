// app/dashboard/_hooks/useCourseStats.tsx
import { useState, useEffect } from 'react';

interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  draftCourses: number;
  uniqueInstructors: number;
  recentCourses: number;
}

interface UseCourseStatsParams {
  session: any;
  enabled: boolean;
}

export function useCourseStats({ session, enabled }: UseCourseStatsParams) {
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !session?.user) return;

    const fetchCourseStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/dashboard/course-stats');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching course stats:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseStats();
  }, [enabled, session?.user]);

  return { stats, isLoading, error };
}