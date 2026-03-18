// hooks/water/useWaterProgress.ts
import { useCallback, useState } from 'react';
import { getWaterProgress } from '../../api/waterApi';

export interface WaterProgress {
  today: string;
  goal_ml: number;
  consumed_ml: number;
  percentage: number;
  is_goal_reached: boolean;
}

export const useWaterProgress = () => {
  const [progress, setProgress] = useState<WaterProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async (userId: string) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getWaterProgress(userId);
      setProgress(data);
    } catch (err: any) {
      console.log("Lỗi lấy tiến độ nước:", err);
      setError(err?.response?.data?.message || "Không thể tải thông tin nước.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { progress, loading, error, fetchProgress };
};