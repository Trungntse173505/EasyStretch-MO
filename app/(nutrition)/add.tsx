// app/nutrition/add.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createFood, Food, logMealItem } from '../../api/nutritionApi';

// Định nghĩa kiểu cho món ăn đang chờ trong danh sách tạm
interface PendingFood extends Food {
    quantity: number;
    isNew?: boolean; // Đánh dấu nếu đây là món mới chưa có trên server
}

export default function AddMealScreen() {
  const router = useRouter();
  const [mealType, setMealType] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER'>('LUNCH');
  const [loading, setLoading] = useState(false);
  
  // GIẢ LẬP: Danh sách món người dùng đã chọn.
  // Thực tế bạn sẽ cần một Modal để thêm món vào danh sách này.
  const [pendingFoods, setPendingFoods] = useState<PendingFood[]>([
    { id: 'existing_food_id_123', name: 'Cơm trắng (Có sẵn)', quantity: 2, calories: 260, protein: 5, fat: 1, carbs: 50 },
    { name: 'Trứng chiên (Mới)', quantity: 1, calories: 150, protein: 10, fat: 12, carbs: 2, isNew: true }
  ]);

  // --- LOGIC QUAN TRỌNG NHẤT: XỬ LÝ LƯU BỮA ĂN ---
  const handleSaveMeal = async () => {
    if (pendingFoods.length === 0) {
        Alert.alert("Thông báo", "Vui lòng thêm ít nhất một món ăn.");
        return;
    }

    setLoading(true);
    // Giả định userId, thực tế bạn lấy từ context hoặc storage
    const userId = "2758a251-ccf1-47de-981f-62a068c94822"; 
    const date = new Date().toISOString().split('T')[0]; // Ngày hôm nay: YYYY-MM-DD

    try {
      // Duyệt qua từng món trong danh sách chờ
      for (const foodItem of pendingFoods) {
        let foodId = foodItem.id;

        // 1. Nếu là món mới (chưa có ID), gọi API tạo Food trước
        if (foodItem.isNew || !foodId) {
            console.log(`Đang tạo món mới: ${foodItem.name}`);
            const newFoodData = await createFood({
                name: foodItem.name,
                calories: foodItem.calories,
                protein: foodItem.protein,
                fat: foodItem.fat,
                carbs: foodItem.carbs,
            });
            foodId = newFoodData.id; // Lấy ID thật từ server trả về
            console.log(`Đã tạo xong, ID mới là: ${foodId}`);
        }

        // 2. Sau khi đã có food_id chắc chắn, gọi API tạo Meal
        if (foodId) {
            console.log(`Đang lưu bữa ăn cho món: ${foodItem.name} với ID: ${foodId}`);
            await logMealItem({
                user_id: userId,
                food_id: foodId,
                meal_type: mealType,
                quantity: foodItem.quantity,
                consumed_at: date
            });
        }
      }

      Alert.alert("Thành công", "Đã lưu bữa ăn của bạn!", [
        { text: "OK", onPress: () => router.back() } // Quay lại màn hình log
      ]);

    } catch (error) {
      console.error("Lỗi khi lưu bữa ăn:", error);
      Alert.alert("Lỗi", "Không thể lưu bữa ăn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // --- Giao diện (Tương tự như đã bàn) ---
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Loại bữa ăn</Text>
      <View style={styles.typeSelector}>
        {(['BREAKFAST', 'LUNCH', 'DINNER'] as const).map((type) => (
          <TouchableOpacity 
            key={type} 
            style={[styles.typeBtn, mealType === type && styles.activeTypeBtn]}
            onPress={() => setMealType(type)}
          >
            <Text style={mealType === type ? styles.activeTypeText : styles.typeText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Món đã chọn ({pendingFoods.length})</Text>
        <TouchableOpacity style={styles.addFoodBtn} onPress={() => Alert.alert("Tính năng này cần làm thêm Modal chọn món")}>
          <Text style={styles.addFoodText}>+ Thêm món</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.foodsContainer}>
        {pendingFoods.map((food, index) => (
          <View key={index} style={styles.foodItem}>
            <View style={{flex: 1}}>
              <Text style={styles.foodName}>{food.name} {food.isNew ? '(Mới)' : ''}</Text>
              <Text style={styles.foodDetails}>Số lượng: {food.quantity} | Tổng: {food.calories * food.quantity} kcal</Text>
            </View>
            <TouchableOpacity onPress={() => setPendingFoods(prev => prev.filter((_, i) => i !== index))}>
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal} disabled={loading}>
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.saveButtonText}>Xác Nhận Lưu Bữa Ăn</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  typeBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#E0E0E0', flex: 1, marginHorizontal: 5, alignItems: 'center' },
  activeTypeBtn: { backgroundColor: '#F27B35' },
  typeText: { color: '#555', fontWeight: 'bold' },
  activeTypeText: { color: '#FFF', fontWeight: 'bold' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  addFoodBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#E8F5E9', borderRadius: 10 },
  addFoodText: { color: '#4CAF50', fontWeight: 'bold' },
  foodsContainer: { marginBottom: 30 },
  foodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  foodName: { fontSize: 16, fontWeight: 'bold' },
  foodDetails: { color: '#888', marginTop: 4 },
  saveButton: { backgroundColor: '#8DC63F', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});