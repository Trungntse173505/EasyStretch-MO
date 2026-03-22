// hooks/auth/useLeaderboard.ts
import authApi, { LeaderboardUser } from "@/api/authApi";
import { useCallback, useEffect, useState } from "react";

export const useLeaderboard = () => {
  const [data, setData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await authApi.getLeaderboard();
      const items = response?.data?.data || response?.data || [];
      setData(items);
    } catch (e: any) {
      console.log("Error getLeaderboard:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { data, loading, refresh: fetchLeaderboard };
};
