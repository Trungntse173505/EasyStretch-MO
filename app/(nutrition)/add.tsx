// app/nutrition/add.tsx
import { useUser } from '@/hooks/auth/useUser';
import { useFood } from '@/hooks/notrition/useFood';
import { PendingFood, useMeal } from '@/hooks/notrition/useMeal';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Food } from '../../api/nutritionApi';

type ModalStep = 'SEARCH' | 'CREATE' | 'QUANTITY';

export default function AddMealScreen() {
  const router = useRouter();
  const [mealType, setMealType] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER'>('LUNCH');
  const [pendingFoods, setPendingFoods] = useState<PendingFood[]>([]);
  const { foods: dbFoods, loadingFoods, fetchFoodsList } = useFood();
  const { saveMealFlow, loading: isSaving } = useMeal();
  const { user } = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('SEARCH');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFood, setTempFood] = useState<PendingFood | null>(null);
  const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '', fat: '', carbs: '' });
  const [quantityInput, setQuantityInput] = useState('1');

  // Load danh sách món ăn từ server khi mở modal
  useEffect(() => {
    if (isModalVisible && modalStep === 'SEARCH') {
      fetchFoodsList();
    }
  }, [isModalVisible, modalStep]);

  // --- LOGIC LƯU BỮA ĂN ---
  const handleSaveMeal = async () => {
    if (pendingFoods.length === 0) {
        Alert.alert("Thông báo", "Vui lòng thêm ít nhất một món ăn.");
        return;
    }

    if (!user?.id) {
        Alert.alert("Lỗi", "Đang tải thông tin người dùng hoặc chưa đăng nhập. Vui lòng thử lại sau.");
        return;
    }

    const date = new Date().toISOString(); 

    // Gọi API qua hook bằng ID thật
    const result = await saveMealFlow(user.id, mealType, date, pendingFoods);

    if (result.success) {
      Alert.alert("Thành công", "Bữa ăn đã được lưu vào nhật ký!", [
        { text: "Tuyệt vời", onPress: () => router.back() }
      ]);
    } else {
      Alert.alert("Lỗi", "Không thể lưu bữa ăn. Vui lòng thử lại.");
    }
  };

  // --- MODAL HANDLERS ---
  const openModal = () => {
    setModalStep('SEARCH');
    setSearchQuery('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTempFood(null);
    setNewFood({ name: '', calories: '', protein: '', fat: '', carbs: '' });
    setQuantityInput('1');
  };

  const handleSelectExistingFood = (food: Food) => {
    setTempFood({ ...food, quantity: 1, isNew: false });
    setQuantityInput('1');
    setModalStep('QUANTITY');
  };

  const handleCreateNewFoodSubmit = () => {
    if (!newFood.name || !newFood.calories) {
      Alert.alert("Lỗi", "Vui lòng nhập ít nhất tên và lượng Calories.");
      return;
    }
    const createdTempFood: PendingFood = {
      name: newFood.name,
      calories: Number(newFood.calories),
      protein: Number(newFood.protein || 0),
      fat: Number(newFood.fat || 0),
      carbs: Number(newFood.carbs || 0),
      quantity: 1,
      isNew: true
    };
    setTempFood(createdTempFood);
    setQuantityInput('1');
    setModalStep('QUANTITY');
  };

  const handleConfirmAddFood = () => {
    if (tempFood) {
      const finalFoodToAdd = { ...tempFood, quantity: Number(quantityInput) || 1 };
      setPendingFoods([...pendingFoods, finalFoodToAdd]);
      closeModal();
    }
  };

  const filteredFoods = dbFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 20}}>
        <Text style={styles.sectionTitle}>Thời điểm ăn</Text>
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
          <Text style={styles.sectionTitle}>Món ăn đã chọn</Text>
          <TouchableOpacity style={styles.addFoodBtn} onPress={openModal}>
            <Text style={styles.addFoodText}>+ Thêm món</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.foodsContainer}>
          {pendingFoods.length === 0 ? (
             <Text style={styles.emptyText}>Chưa có món ăn nào. Hãy thêm món ăn nhé!</Text>
          ) : (
            pendingFoods.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={{flex: 1}}>
                  <Text style={styles.foodName}>{food.name} {food.isNew ? '' : ''}</Text>
                  <Text style={styles.foodDetails}>Sl: {food.quantity} | {food.calories * food.quantity} kcal</Text>
                </View>
                <TouchableOpacity onPress={() => setPendingFoods(prev => prev.filter((_, i) => i !== index))}>
                    <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal} disabled={isSaving}>
          {isSaving ? (
              <ActivityIndicator color="#111" />
          ) : (
              <Text style={styles.saveButtonText}>Xác nhận</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* --- MODAL THÊM MÓN ĂN --- */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              if (modalStep === 'QUANTITY') setModalStep(tempFood?.isNew ? 'CREATE' : 'SEARCH');
              else if (modalStep === 'CREATE') setModalStep('SEARCH');
              else closeModal();
            }}>
              <Ionicons name="chevron-back" size={28} color="#111" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {modalStep === 'SEARCH' ? 'Tìm món ăn' : modalStep === 'CREATE' ? 'Tạo món mới' : 'Nhập số lượng'}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={28} color="#111" />
            </TouchableOpacity>
          </View>

          {/* STEP 1: TÌM KIẾM */}
          {modalStep === 'SEARCH' && (
            <View style={styles.modalContent}>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm tên món ăn..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.createNewBtn} onPress={() => setModalStep('CREATE')}>
                <Ionicons name="add-circle-outline" size={20} color="#111" />
                <Text style={styles.createNewBtnText}>Tạo món mới ngay</Text>
              </TouchableOpacity>
              
              {loadingFoods ? (
                <ActivityIndicator color="#111" style={{marginTop: 20}} />
              ) : (
                <FlatList
                  data={filteredFoods}
                  keyExtractor={(item, index) => item.id || index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.searchResultItem} onPress={() => handleSelectExistingFood(item)}>
                      <Text style={styles.searchResultName}>{item.name}</Text>
                      <Text style={styles.searchResultCal}>{item.calories} kcal</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={styles.emptySearchText}>Không tìm thấy kết quả phù hợp.</Text>}
                />
              )}
            </View>
          )}

          {/* STEP 2: TẠO MÓN MỚI */}
          {modalStep === 'CREATE' && (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Tên món ăn (*)</Text>
              <TextInput style={styles.inputField} placeholder="VD: Bò bít tết" value={newFood.name} onChangeText={(t) => setNewFood({...newFood, name: t})} />
              
              <Text style={styles.inputLabel}>Calories (*)</Text>
              <TextInput style={styles.inputField} placeholder="VD: 250" keyboardType="numeric" value={newFood.calories} onChangeText={(t) => setNewFood({...newFood, calories: t})} />
              
              <View style={{flexDirection: 'row', gap: 10}}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Protein (g)</Text>
                  <TextInput style={styles.inputField} keyboardType="numeric" value={newFood.protein} onChangeText={(t) => setNewFood({...newFood, protein: t})} />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Carbs (g)</Text>
                  <TextInput style={styles.inputField} keyboardType="numeric" value={newFood.carbs} onChangeText={(t) => setNewFood({...newFood, carbs: t})} />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Fat (g)</Text>
                  <TextInput style={styles.inputField} keyboardType="numeric" value={newFood.fat} onChangeText={(t) => setNewFood({...newFood, fat: t})} />
                </View>
              </View>

              <TouchableOpacity style={styles.saveModalBtn} onPress={handleCreateNewFoodSubmit}>
                <Text style={styles.saveModalBtnText}>Tiếp tục</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* STEP 3: NHẬP SỐ LƯỢNG */}
          {modalStep === 'QUANTITY' && (
            <View style={styles.modalContent}>
              <View style={styles.quantityCard}>
                <Text style={styles.quantityFoodName}>{tempFood?.name}</Text>
                <Text style={styles.quantityMacros}>1 phần = {tempFood?.calories} kcal</Text>
              </View>

              <Text style={styles.inputLabel}>Số lượng (phần):</Text>
              <TextInput 
                style={styles.inputField} 
                keyboardType="numeric" 
                value={quantityInput} 
                onChangeText={setQuantityInput} 
                autoFocus
              />
              <Text style={styles.totalCalText}>
                Tổng: <Text style={{fontWeight: 'bold'}}>{(tempFood?.calories || 0) * (Number(quantityInput) || 0)} kcal</Text>
              </Text>

              <TouchableOpacity style={styles.saveModalBtn} onPress={handleConfirmAddFood}>
                <Text style={styles.saveModalBtnText}>Thêm vào bữa ăn</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#9CA3AF', marginBottom: 15, textTransform: 'uppercase' },
  typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center' },
  activeTypeBtn: { backgroundColor: '#D4F93D' },
  typeText: { color: '#6B7280', fontWeight: 'bold', fontSize: 12 },
  activeTypeText: { color: '#111', fontWeight: 'bold', fontSize: 12 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  addFoodBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  addFoodText: { color: '#111', fontWeight: '700', fontSize: 13 },
  foodsContainer: { marginBottom: 30 },
  foodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 16, marginBottom: 12 },
  foodName: { fontSize: 16, fontWeight: '800', color: '#111' },
  foodDetails: { color: '#6B7280', marginTop: 4, fontWeight: '600', fontSize: 13 },
  emptyText: { color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
  footer: { marginBottom: 40, paddingHorizontal: 20},
  saveButton: { backgroundColor: '#D4F93D', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  saveButtonText: { color: '#111', fontSize: 16, fontWeight: '900' },

  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalContent: { padding: 20, flex: 1 },
  searchInput: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 15 },
  createNewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D4F93D', padding: 12, borderRadius: 12, marginBottom: 20 },
  createNewBtnText: { marginLeft: 8, fontWeight: 'bold', fontSize: 14 },
  searchResultItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  searchResultName: { fontSize: 16, fontWeight: '600' },
  searchResultCal: { color: '#6B7280' },
  emptySearchText: { textAlign: 'center', color: '#9CA3AF', marginTop: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151', marginTop: 15 },
  inputField: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', padding: 15, borderRadius: 12, fontSize: 16 },
  saveModalBtn: { backgroundColor: '#111', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  saveModalBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  quantityCard: { backgroundColor: '#F3F4F6', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  quantityFoodName: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  quantityMacros: { color: '#6B7280' },
  totalCalText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: '#374151' }
});