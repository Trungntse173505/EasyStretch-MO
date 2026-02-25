// hooks/nutrition/useFood.ts
import { useCallback, useState } from 'react';
import { Food, getFoods } from '../../api/nutritionApi';

export const useFood = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loadingFoods, setLoadingFoods] = useState(false);

  // Hàm lấy danh sách món ăn từ server
  const fetchFoodsList = useCallback(async () => {
    setLoadingFoods(true);
    try {
      const response = await getFoods();
      // Tùy theo cấu trúc BE trả về, có thể là response.data hoặc trực tiếp mảng
      const data = response?.data || response || [];
      setFoods(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách món ăn:", error);
    } finally {
      setLoadingFoods(false);
    }
  }, []);

  return { foods, loadingFoods, fetchFoodsList };
};