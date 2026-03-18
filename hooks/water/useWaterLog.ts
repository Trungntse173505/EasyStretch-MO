// hooks/water/useWaterLog.ts
import { useState } from 'react';
import { logWater } from '../../api/waterApi';

export const useWaterLog = () => {
  const [isDrinking, setIsDrinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addWaterLog = async (userId: string, amountMl: number) => {
    if (!userId) return { success: false, message: "Thiếu thông tin người dùng." };
    setIsDrinking(true);
    setError(null);
    try {
      await logWater({ user_id: userId, amount_ml: amountMl });
      return { success: true };
    } catch (err: any) {
      console.log("Lỗi ghi nhận nước:", err);
      const errMsg = err?.response?.data?.message || "Không thể lưu lượng nước uống.";
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setIsDrinking(false);
    }
  };

  return { isDrinking, error, addWaterLog };
};