// hooks/water/useWaterProgress.ts
import { useCallback, useState } from 'react';
import { getWaterLogByDay, getWaterProgress } from '../../api/waterApi';

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

  const fetchProgress = useCallback(async (userId: string, date?: string) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      let data;
      if (!date || date === today) {
        // Ngày hôm nay → dùng endpoint progress
        data = await getWaterProgress(userId);
      } else {
        // Ngày cũ → dùng endpoint log/daily, map về cùng shape
        const logData = await getWaterLogByDay(userId, date);
        data = {
          today: date,
          goal_ml: logData.goal_ml ?? 0,
          consumed_ml: logData.consumed_ml ?? logData.total_ml ?? 0,
          percentage: logData.percentage ?? 0,
          is_goal_reached: logData.is_goal_reached ?? false,
        };
      }
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