// api/nutritionApi.ts
import axiosClient from './axiosClient';

// ==========================================
// 1. INTERFACES (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ==========================================

export interface Food {
  id?: string; 
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image_url?: string | null;
}

export interface MealItemRequest {
  id?: string; // Dùng khi cần PATCH/DELETE
  user_id: string;
  food_id: string;
  meal_type: string; // "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"
  quantity: number;
  consumed_at: string; // VD: "2026-02-23"
}

export interface AiQuestionResponse {
  answer: string;
}

// ==========================================
// 2. FOODS APIs
// ==========================================

// [GET] /foods - Tìm tất cả foods
export const getFoods = async () => {
  const response = await axiosClient.get('/foods');
  return response.data;
};

// [GET] /foods/{id} - Tìm food theo id
export const getFoodById = async (id: string) => {
  const response = await axiosClient.get(`/foods/${id}`);
  return response.data;
};

// [POST] /foods - Tạo mới 1 food
export const createFood = async (foodData: Food) => {
  const response = await axiosClient.post('/foods', foodData);
  return response.data; 
};

// [POST] /foods/many - Tạo mới nhiều food cùng lúc
export const createManyFoods = async (foods: Food[]) => {
  const response = await axiosClient.post('/foods/many', foods);
  return response.data; 
};

// [PATCH] /foods/{id} - Cập nhật food
export const updateFood = async (id: string, foodData: Partial<Food>) => {
  const response = await axiosClient.patch(`/foods/${id}`, foodData);
  return response.data;
};

// [DELETE] /foods/{id} - Xóa food (Cần truyền id ở cả URL và Body)
export const deleteFood = async (id: string) => {
  const response = await axiosClient.delete(`/foods/${id}`, {
    data: { id: id }
  });
  return response.data;
};

// ==========================================
// 3. MEALS APIs
// ==========================================

// [GET] /meals - Lấy thông tin meal của user theo ngày
export const getMeals = async (userId: string, date: string) => {
  // Query params: ?user_id=...&date=...
  const response = await axiosClient.get('/meals', {
    params: {
      user_id: userId,
      date: date
    }
  });
  return response.data;
};

// [POST] /meals - Tạo mới 1 meal
export const logMealItem = async (mealData: MealItemRequest) => {
  const response = await axiosClient.post('/meals', mealData);
  return response.data;
};

// [POST] /meals/many - Tạo mới nhiều meal cùng lúc
export const logManyMealItems = async (meals: MealItemRequest[]) => {
  const response = await axiosClient.post('/meals/many', meals);
  return response.data;
};

// [PATCH] /meals/{id} - Cập nhật meal
export const updateMealItem = async (id: string, mealData: Partial<MealItemRequest>) => {
  const response = await axiosClient.patch(`/meals/${id}`, mealData);
  return response.data;
};

// [DELETE] /meals/{id} - Xóa meal (Cần truyền id ở cả URL và Body)
export const deleteMealItem = async (id: string) => {
  const response = await axiosClient.delete(`/meals/${id}`, {
    data: { id: id }
  });
  return response.data;
};

// ==========================================
// 4. AI APIs
// ==========================================

// [POST] /ai/question/nutritionist - Trò chuyện với AI Dinh dưỡng
export const askAiNutritionist = async (question: string): Promise<AiQuestionResponse> => {
  const response = await axiosClient.post('/ai/question/nutritionist', {
    question: question
  });
  return response.data;
};