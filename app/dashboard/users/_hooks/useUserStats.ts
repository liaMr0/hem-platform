// app/admin/users/_hooks/useUserStats.ts (Updated)
import { useState, useEffect, useCallback } from "react";
import { Session } from "next-auth";
import { UserService } from "../_services/userService";
import { UserStats } from "../_types/component-props";

interface UseUserStatsProps {
  session: Session | null;
  enabled: boolean;
}

export function useUserStats({ session, enabled }: UseUserStatsProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!session?.user || !enabled) return;

    try {
      const data = await UserService.fetchUserStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  }, [session, enabled]);

  const refreshStats = useCallback(() => {
    if (enabled) {
      loadStats();
    }
  }, [enabled, loadStats]);

  useEffect(() => {
    if (enabled) {
      loadStats();
    }
  }, [enabled, loadStats]);

  return { stats, loading, refreshStats };
}
