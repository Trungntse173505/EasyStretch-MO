// hooks/water/useWaterSettings.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { getWaterSettings, updateWaterSettings, WaterSettingsRequest } from '../../api/waterApi';

const SETTINGS_KEY = '@water_settings';

export const useWaterSettings = () => {
  const [isLoading, setIsLoading] = useState(false);

  // HÀM 1: LẤY DỮ LIỆU (Ưu tiên lấy từ Local trước cho nhanh)
  const fetchSettings = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      // 1. Lấy từ máy điện thoại lên xem có không
      const localData = await AsyncStorage.getItem(SETTINGS_KEY);

      // 2. Ngầm gọi BE để lấy data mới nhất (đề phòng user vừa đổi điện thoại)
      // Chú ý: Không dùng await ở đây để app không bị khựng lại
      getWaterSettings(userId).then(async (res) => {
        // Nếu BE trả về data hợp lệ, lưu đè xuống máy điện thoại
        if (res && res.data) {
          await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(res.data));
        }
      }).catch(err => console.log("Lỗi đồng bộ ngầm từ BE:", err));

      // 3. Trả về kết quả cho màn hình hiển thị
      if (localData) {
        return JSON.parse(localData); // Trả về data có sẵn trong máy liền lập tức
      } else {
        // Nếu máy trắng tinh (mới cài app), thì phải ráng chờ BE trả về
        const res = await getWaterSettings(userId);
        if (res && res.data) {
          await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(res.data));
          return res.data;
        }
      }
    } catch (err) {
      console.log("Lỗi tải cài đặt:", err);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  // HÀM 2: LƯU DỮ LIỆU NGẦM (Lưu lên BE mà không bắt người dùng đợi)
  const syncToBackend = async (data: WaterSettingsRequest) => {
    try {
      await updateWaterSettings(data);
    } catch (err: any) {
      console.log("Lỗi đẩy lên Server:", err?.response?.data?.message || err.message);
    }
  };

  return { isLoading, fetchSettings, syncToBackend };
};