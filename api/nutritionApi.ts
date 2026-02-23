// api/nutritionApi.ts
import axiosClient from './axiosClient'; // Sử dụng axiosClient có sẵn của bạn

// Định nghĩa kiểu dữ liệu cho Food và MealItem
export interface Food {
  id?: string; // ID có thể chưa có nếu là món mới
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  description?: string;
  image_url?: string;
}

export interface MealItemRequest {
  user_id: string;
  food_id: string;
  meal_type: string;
  quantity: number;
  consumed_at: string;
}

// API lấy danh sách món ăn (để tìm kiếm)
export const getFoods = async () => {
  const response = await axiosClient.get('/foods');
  return response.data;
};

// API tạo món ăn mới
export const createFood = async (foodData: Food) => {
  const response = await axiosClient.post('/foods', foodData);
  return response.data; 
};

// API lưu một mục nhật ký ăn uống
export const logMealItem = async (mealData: MealItemRequest) => {
  const response = await axiosClient.post('/meals', mealData);
  return response.data;
};