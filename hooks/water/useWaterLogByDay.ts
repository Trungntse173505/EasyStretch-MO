// hooks/water/useWaterLogByDay.ts
import { getWaterLogByDay } from '@/api/waterApi';
import { useCallback, useState } from 'react';

export interface WaterLogEntry {
  id: string;
  amount_ml: number;
  consumed_at: string; // ISO string (trùng khớp với API backend)
}

export const useWaterLogByDay = () => {
  const [logs, setLogs] = useState<WaterLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogByDay = useCallback(async (userId: string, date: string) => {
    try {
      setLoading(true);
      const response: any = await getWaterLogByDay(userId, date);
      const items = response?.data || response || [];
      setLogs(Array.isArray(items) ? items : []);
    } catch (e: any) {
      console.log('Error getWaterLogByDay:', e);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { logs, loading, fetchLogByDay };
};
