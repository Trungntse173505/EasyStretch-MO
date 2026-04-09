import { Food } from '@/api/nutritionApi';

export interface LocalFood extends Food {
  categories: string[]; // Đồng bộ với Backend API
}

export const LOCAL_FOODS: LocalFood[] = [
  // 1. Tinh bột (Carbs) + Mix
  { id: 'local-1', name: 'Cơm trắng (1 chén)', calories: 130, protein: 3, carbs: 28, fat: 0.3, categories: ['Tinh bột'], image_url: null },
  { id: 'local-2', name: 'Cơm gạo lứt (1 chén)', calories: 110, protein: 3, carbs: 23, fat: 1, categories: ['Tinh bột'], image_url: null },
  { id: 'local-3', name: 'Cơm tấm sườn bì chả (1 đĩa)', calories: 650, protein: 25, carbs: 80, fat: 20, categories: ['Tinh bột', 'Thịt', 'Trứng'], image_url: null },
  { id: 'local-4', name: 'Phở bò (1 tô)', calories: 450, protein: 20, carbs: 55, fat: 15, categories: ['Tinh bột', 'Thịt'], image_url: null },
  { id: 'local-5', name: 'Bún bò Huế (1 tô)', calories: 500, protein: 22, carbs: 60, fat: 18, categories: ['Tinh bột', 'Thịt'], image_url: null },
  { id: 'local-6', name: 'Hủ tiếu Nam Vang (1 tô)', calories: 400, protein: 18, carbs: 45, fat: 12, categories: ['Tinh bột', 'Thịt', 'Hải sản'], image_url: null },
  { id: 'local-7', name: 'Bún chả Hà Nội (1 suất)', calories: 550, protein: 25, carbs: 65, fat: 22, categories: ['Tinh bột', 'Thịt', 'Rau Xanh & Salad'], image_url: null },
  { id: 'local-8', name: 'Bún riêu cua (1 tô)', calories: 380, protein: 15, carbs: 40, fat: 14, categories: ['Tinh bột', 'Hải sản', 'Trứng'], image_url: null },
  { id: 'local-9', name: 'Bánh mì thịt/chả (1 ổ)', calories: 350, protein: 15, carbs: 40, fat: 12, categories: ['Tinh bột', 'Thịt'], image_url: null },
  { id: 'local-10', name: 'Khoai lang luộc (1 củ)', calories: 112, protein: 2, carbs: 26, fat: 0.1, categories: ['Tinh bột', 'Rau Xanh & Salad'], image_url: null },
  { id: 'local-11', name: 'Bắp luộc (1 trái)', calories: 150, protein: 5, carbs: 30, fat: 2, categories: ['Tinh bột'], image_url: null },

  // 2. Thịt & Hải sản
  { id: 'local-12', name: 'Ức gà luộc (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, categories: ['Thịt'], image_url: null },
  { id: 'local-13', name: 'Đùi gà nướng (100g)', calories: 250, protein: 22, carbs: 0, fat: 15, categories: ['Thịt'], image_url: null },
  { id: 'local-14', name: 'Thịt heo quay (100g)', calories: 350, protein: 16, carbs: 0, fat: 30, categories: ['Thịt'], image_url: null },
  { id: 'local-15', name: 'Thịt bò xào (100g)', calories: 220, protein: 24, carbs: 5, fat: 12, categories: ['Thịt'], image_url: null },
  { id: 'local-16', name: 'Cá hồi áp chảo (100g)', calories: 206, protein: 22, carbs: 0, fat: 13, categories: ['Hải sản'], image_url: null },
  { id: 'local-17', name: 'Cá phi lê chiên (100g)', calories: 250, protein: 18, carbs: 10, fat: 15, categories: ['Hải sản'], image_url: null },
  { id: 'local-18', name: 'Tôm luộc (100g)', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, categories: ['Hải sản'], image_url: null },
  { id: 'local-19', name: 'Thịt kho trứng (1 phần)', calories: 350, protein: 18, carbs: 5, fat: 28, categories: ['Thịt', 'Trứng'], image_url: null },

  // 3. Trứng & Sữa
  { id: 'local-20', name: 'Trứng gà luộc (1 quả)', calories: 78, protein: 6, carbs: 0.6, fat: 5, categories: ['Trứng'], image_url: null },
  { id: 'local-21', name: 'Trứng chiên (1 quả)', calories: 110, protein: 6, carbs: 1, fat: 9, categories: ['Trứng'], image_url: null },
  { id: 'local-22', name: 'Đậu hũ chiên (100g)', calories: 270, protein: 18, carbs: 10, fat: 20, categories: ['Sữa'], image_url: null },
  { id: 'local-23', name: 'Sữa tươi không đường (200ml)', calories: 120, protein: 6, carbs: 10, fat: 6, categories: ['Sữa', 'Đồ Uống'], image_url: null },
  { id: 'local-24', name: 'Sữa chua (1 hộp)', calories: 100, protein: 4, carbs: 15, fat: 3, categories: ['Sữa'], image_url: null },

  // 4. Rau Xanh & Salad
  { id: 'local-25', name: 'Salad gà (1 dĩa)', calories: 220, protein: 18, carbs: 10, fat: 12, categories: ['Rau Xanh & Salad', 'Thịt'], image_url: null },
  { id: 'local-26', name: 'Rau cải luộc (1 chén)', calories: 25, protein: 2, carbs: 4, fat: 0.1, categories: ['Rau Xanh & Salad'], image_url: null },
  { id: 'local-27', name: 'Rau muống xào tỏi (1 đĩa)', calories: 150, protein: 4, carbs: 6, fat: 12, categories: ['Rau Xanh & Salad'], image_url: null },
  { id: 'local-28', name: 'Cà chua (100g)', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, categories: ['Rau Xanh & Salad', 'Trái cây'], image_url: null },
  { id: 'local-29', name: 'Bông cải xanh luộc (100g)', calories: 35, protein: 2.8, carbs: 7, fat: 0.4, categories: ['Rau Xanh & Salad'], image_url: null },

  // 5. Trái cây
  { id: 'local-30', name: 'Chuối (1 quả)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, categories: ['Trái cây'], image_url: null },
  { id: 'local-31', name: 'Táo (1 quả)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, categories: ['Trái cây'], image_url: null },
  { id: 'local-32', name: 'Dưa hấu (1 miếng)', calories: 85, protein: 1.6, carbs: 21, fat: 0.4, categories: ['Trái cây'], image_url: null },
  { id: 'local-33', name: 'Bơ sáp (1/2 quả)', calories: 160, protein: 2, carbs: 9, fat: 15, categories: ['Trái cây'], image_url: null },
  { id: 'local-34', name: 'Đu đủ (1 miếng)', calories: 55, protein: 0.8, carbs: 14, fat: 0.2, categories: ['Trái cây'], image_url: null },

  // 6. Fast Food & Ăn vặt
  { id: 'local-35', name: 'Gà rán KFC (1 miếng)', calories: 320, protein: 15, carbs: 12, fat: 22, categories: ['Fast Food & Ăn vặt', 'Thịt'], image_url: null },
  { id: 'local-36', name: 'Pizza (1 miếng)', calories: 285, protein: 12, carbs: 35, fat: 10, categories: ['Fast Food & Ăn vặt', 'Tinh bột'], image_url: null },
  { id: 'local-37', name: 'Khoai tây chiên (1 phần)', calories: 310, protein: 3, carbs: 40, fat: 15, categories: ['Fast Food & Ăn vặt', 'Tinh bột'], image_url: null },
  { id: 'local-38', name: 'Bánh bao nhân thịt (1 cái)', calories: 350, protein: 10, carbs: 40, fat: 16, categories: ['Fast Food & Ăn vặt', 'Tinh bột', 'Thịt'], image_url: null },
  { id: 'local-39', name: 'Bánh giò (1 cái)', calories: 280, protein: 8, carbs: 30, fat: 15, categories: ['Fast Food & Ăn vặt', 'Tinh bột', 'Thịt'], image_url: null },
  { id: 'local-40', name: 'Xúc xích (1 cây)', calories: 150, protein: 5, carbs: 2, fat: 13, categories: ['Fast Food & Ăn vặt', 'Thịt'], image_url: null },
  { id: 'local-41', name: 'Xôi mặn (1 gói)', calories: 450, protein: 12, carbs: 60, fat: 18, categories: ['Fast Food & Ăn vặt', 'Tinh bột', 'Thịt'], image_url: null },
  { id: 'local-42', name: 'Bánh tráng trộn (1 bịch)', calories: 340, protein: 6, carbs: 45, fat: 16, categories: ['Fast Food & Ăn vặt'], image_url: null },
  { id: 'local-43', name: 'Snack khoai tây (1 gói)', calories: 160, protein: 2, carbs: 15, fat: 10, categories: ['Fast Food & Ăn vặt'], image_url: null },
  { id: 'local-44', name: 'Trà sữa trân châu (1 ly)', calories: 450, protein: 5, carbs: 70, fat: 15, categories: ['Fast Food & Ăn vặt', 'Đồ Uống'], image_url: null },

  // 7. Đồ Uống
  { id: 'local-45', name: 'Cà phê sữa đá (1 ly)', calories: 180, protein: 3, carbs: 28, fat: 6, categories: ['Đồ Uống'], image_url: null },
  { id: 'local-46', name: 'Nước ép cam nguyên chất (1 ly)', calories: 110, protein: 2, carbs: 25, fat: 0.5, categories: ['Đồ Uống', 'Trái cây'], image_url: null },
  { id: 'local-47', name: 'Sinh tố bơ (1 ly)', calories: 350, protein: 5, carbs: 30, fat: 22, categories: ['Đồ Uống', 'Trái cây'], image_url: null },
  { id: 'local-48', name: 'Nước dừa (1 trái)', calories: 45, protein: 1, carbs: 10, fat: 0, categories: ['Đồ Uống'], image_url: null },
  { id: 'local-49', name: 'Coca Cola (1 lon)', calories: 140, protein: 0, carbs: 39, fat: 0, categories: ['Đồ Uống', 'Fast Food & Ăn vặt'], image_url: null },
  { id: 'local-50', name: 'Protein Shake (1 ly)', calories: 150, protein: 24, carbs: 5, fat: 2, categories: ['Đồ Uống', 'Sữa'], image_url: null },
];
