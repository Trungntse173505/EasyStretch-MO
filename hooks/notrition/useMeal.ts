// hooks/nutrition/useMeal.ts
import { useCallback, useState } from 'react';
import { createManyFoods, Food, getMeals, logManyMealItems, MealItemRequest } from '../../api/nutritionApi';

// Định nghĩa type riêng cho món ăn đang được chọn (có kèm số lượng và trạng thái mới)
export interface PendingFood extends Food {
  quantity: number;
  isNew?: boolean; 
}

export const useMeal = () => {
  const [dailyMeals, setDailyMeals] = useState<any>(null); // Lưu JSON tổng calo và các bữa ăn
  const [loading, setLoading] = useState(false);

  // =====================================
  // 1. HÀM LẤY DỮ LIỆU BỮA ĂN THEO NGÀY (Dùng cho log.tsx)
  // =====================================
  const fetchDailyMeals = useCallback(async (userId: string, date: string) => {
    setLoading(true);
    try {
      const response = await getMeals(userId, date);
      setDailyMeals(response?.data || response);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu lịch sử bữa ăn:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================
  // 2. LUỒNG THÊM BỮA ĂN THÔNG MINH (Dùng cho add.tsx)
  // =====================================
  const saveMealFlow = async (
    userId: string, 
    mealType: string, 
    consumedAt: string, 
    selectedFoods: PendingFood[]
  ) => {
    try {
      setLoading(true);

      // Bước 1: Phân loại món cũ (đã có ID) và món mới (isNew = true)
      const existingFoods = selectedFoods.filter(f => !f.isNew && f.id);
      const newFoods = selectedFoods.filter(f => f.isNew);
      
      let finalFoodsList = [...existingFoods];

      // Bước 2: Nếu có món MỚI, gọi API POST /foods/many
      if (newFoods.length > 0) {
        // Loại bỏ các trường UI (quantity, isNew) trước khi gửi tạo Food
        const foodsToCreate = newFoods.map(({ quantity, isNew, ...rest }) => rest as Food);
        const createRes = await createManyFoods(foodsToCreate);
        
        const createdData = createRes?.data || createRes; // Mảng các món ăn đã được BE cấp ID
        
        if (createdData && Array.isArray(createdData)) {
          // Lắp lại quantity vào món ăn vừa được tạo
          const createdFoodsWithQty = createdData.map((food: any, index: number) => ({
            ...food,
            quantity: newFoods[index].quantity
          }));
          finalFoodsList = [...finalFoodsList, ...createdFoodsWithQty];
        } else {
          throw new Error("Tạo món ăn mới thất bại từ phía server");
        }
      }

      // Bước 3: Đưa toàn bộ danh sách món ăn vào chuẩn định dạng MealItemRequest
      const mealItemsToLog: MealItemRequest[] = finalFoodsList.map(item => ({
        user_id: userId,
        food_id: item.id!, // Lúc này 100% các món đều đã có ID
        meal_type: mealType,
        quantity: item.quantity,
        consumed_at: consumedAt
      }));

      // Bước 4: Gọi API duy nhất POST /meals/many để ghi vào nhật ký
      await logManyMealItems(mealItemsToLog);

      return { success: true };
    } catch (error) {
      console.error("Lỗi luồng xử lý bữa ăn:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { 
    dailyMeals, 
    loading, 
    fetchDailyMeals, 
    saveMealFlow 
  };
};