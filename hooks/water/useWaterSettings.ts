// hooks/water/useWaterSettings.ts
import { useState } from 'react';
import { updateWaterSettings, WaterSettingsRequest } from '../../api/waterApi';

type UpdateResult =
  | { success: true; data: any }
  | { success: false; message: string };

export const useWaterSettings = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = async (data: WaterSettingsRequest): Promise<UpdateResult> => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await updateWaterSettings(data);
      return { success: true, data: response };
    } catch (err: any) {
      console.log("Lỗi cài đặt nước:", err);
      const errMsg: string = err?.response?.data?.message || "Không thể lưu cài đặt.";
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, error, updateSettings };
};