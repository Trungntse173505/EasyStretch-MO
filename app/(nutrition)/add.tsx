// app/nutrition/add.tsx
import { useUser } from '@/hooks/auth/useUser';
import { useFood } from '@/hooks/notrition/useFood';
import { PendingFood, useMeal } from '@/hooks/notrition/useMeal';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

  useEffect(() => {
    if (isModalVisible && modalStep === 'SEARCH') {
      fetchFoodsList();
    }
  }, [isModalVisible, modalStep]);

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
    const result = await saveMealFlow(user.id, mealType, date, pendingFoods);

    if (result.success) {
      Alert.alert("Thành công", "Bữa ăn đã được lưu vào nhật ký!", [
        { text: "Tuyệt vời", onPress: () => router.back() }
      ]);
    } else {
      Alert.alert("Lỗi", "Không thể lưu bữa ăn. Vui lòng thử lại.");
    }
  };

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

  const getMealTypeLabel = (type: string) => {
    if (type === 'BREAKFAST') return 'Sáng';
    if (type === 'LUNCH') return 'Trưa';
    return 'Tối';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm Bữa Ăn</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <Text style={styles.sectionTitle}>Thời điểm ăn</Text>
        <View style={styles.typeSelector}>
          {(['BREAKFAST', 'LUNCH', 'DINNER'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeBtn, mealType === type && styles.activeTypeBtn]}
              onPress={() => setMealType(type)}
              activeOpacity={0.8}
            >
              <Text style={mealType === type ? styles.activeTypeText : styles.typeText}>{getMealTypeLabel(type)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Món ăn đã chọn</Text>
        </View>

        <View style={styles.foodsContainer}>
          {pendingFoods.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={48} color="#E2E8F0" />
              <Text style={styles.emptyText}>Chưa có món ăn nào. Hãy thêm món ăn nhé!</Text>
            </View>
          ) : (
            pendingFoods.map((food, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={styles.foodIconWrap}>
                  <Ionicons name="nutrition" size={20} color="#8B5CF6" />
                </View>
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodDetails}>{food.quantity} phần • <Text style={{ fontWeight: '700', color: '#111' }}>{food.calories * food.quantity} kcal</Text></Text>
                </View>
                <TouchableOpacity onPress={() => setPendingFoods(prev => prev.filter((_, i) => i !== index))} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))
          )}

          <TouchableOpacity style={styles.addFoodBigBtn} onPress={openModal} activeOpacity={0.8}>
            <Ionicons name="add-circle" size={24} color="#111" />
            <Text style={styles.addFoodBigText}>Thêm món mới</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal} disabled={isSaving} activeOpacity={0.85}>
          {isSaving ? (
            <ActivityIndicator color="#111" />
          ) : (
            <Text style={styles.saveButtonText}>Xác nhận & Lưu</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* --- MODAL THÊM MÓN ĂN --- */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeModal}>
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              if (modalStep === 'QUANTITY') setModalStep(tempFood?.isNew ? 'CREATE' : 'SEARCH');
              else if (modalStep === 'CREATE') setModalStep('SEARCH');
              else closeModal();
            }} style={styles.modalIconBtn} activeOpacity={0.8}>
              {modalStep === 'SEARCH' ? <Ionicons name="close" size={24} color="#111" /> : <Ionicons name="arrow-back" size={24} color="#111" />}
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {modalStep === 'SEARCH' ? 'Tìm món ăn' : modalStep === 'CREATE' ? 'Tạo món mới' : 'Nhập số lượng'}
            </Text>

            <View style={{ width: 40 }} />
          </View>

          {/* STEP 1: TÌM KIẾM */}
          {modalStep === 'SEARCH' && (
            <View style={styles.modalContent}>
              <View style={styles.searchBarContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginLeft: 15 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm tên món ăn..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <TouchableOpacity style={styles.createNewBtn} onPress={() => setModalStep('CREATE')} activeOpacity={0.8}>
                <View style={styles.createIconWrap}>
                  <Ionicons name="add" size={20} color="#111" />
                </View>
                <Text style={styles.createNewBtnText}>Không tìm thấy? Tạo món mới</Text>
              </TouchableOpacity>

              {loadingFoods ? (
                <ActivityIndicator color="#111" style={{ marginTop: 40 }} />
              ) : (
                <FlatList
                  data={filteredFoods}
                  keyExtractor={(item, index) => item.id || index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.searchResultItem} onPress={() => handleSelectExistingFood(item)} activeOpacity={0.7}>
                      <View style={styles.searchFoodIcon}>
                        <Ionicons name="restaurant-outline" size={20} color="#64748B" />
                      </View>
                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <Text style={styles.searchResultName}>{item.name}</Text>
                        <Text style={styles.searchResultCal}>{item.calories} kcal</Text>
                      </View>
                      <Ionicons name="add-circle" size={28} color="#E2E8F0" />
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={styles.emptySearchText}>Không tìm thấy kết quả phù hợp.</Text>}
                />
              )}
            </View>
          )}

          {/* STEP 2: TẠO MÓN MỚI */}
          {modalStep === 'CREATE' && (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <View style={styles.formCard}>
                  <Text style={styles.inputLabel}>Tên món ăn <Text style={{ color: '#FF3B30' }}>*</Text></Text>
                  <TextInput style={styles.inputField} placeholder="VD: Bò bít tết" placeholderTextColor="#94A3B8" value={newFood.name} onChangeText={(t) => setNewFood({ ...newFood, name: t })} />

                  <Text style={styles.inputLabel}>Calories <Text style={{ color: '#FF3B30' }}>*</Text></Text>
                  <TextInput style={styles.inputField} placeholder="VD: 250" placeholderTextColor="#94A3B8" keyboardType="numeric" value={newFood.calories} onChangeText={(t) => setNewFood({ ...newFood, calories: t })} />

                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Protein (g)</Text>
                      <TextInput style={styles.inputFieldSm} keyboardType="numeric" value={newFood.protein} onChangeText={(t) => setNewFood({ ...newFood, protein: t })} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Carbs (g)</Text>
                      <TextInput style={styles.inputFieldSm} keyboardType="numeric" value={newFood.carbs} onChangeText={(t) => setNewFood({ ...newFood, carbs: t })} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>Fat (g)</Text>
                      <TextInput style={styles.inputFieldSm} keyboardType="numeric" value={newFood.fat} onChangeText={(t) => setNewFood({ ...newFood, fat: t })} />
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.saveModalBtn} onPress={handleCreateNewFoodSubmit} activeOpacity={0.85}>
                  <Text style={styles.saveModalBtnText}>Tiếp tục</Text>
                </TouchableOpacity>
                <View style={{ height: 40 }} />
              </ScrollView>
            </KeyboardAvoidingView>
          )}

          {/* STEP 3: NHẬP SỐ LƯỢNG */}
          {modalStep === 'QUANTITY' && (
            <View style={styles.modalContent}>
              <View style={styles.quantityCard}>
                <View style={styles.qtyIconBg}><Ionicons name="restaurant" size={32} color="#0EA5E9" /></View>
                <Text style={styles.quantityFoodName}>{tempFood?.name}</Text>
                <Text style={styles.quantityMacros}>1 phần = <Text style={{ fontWeight: '800', color: '#111' }}>{tempFood?.calories} kcal</Text></Text>
              </View>

              <Text style={styles.inputLabel}>Số lượng (phần)</Text>
              <TextInput
                style={styles.qtyInputField}
                keyboardType="numeric"
                value={quantityInput}
                onChangeText={setQuantityInput}
                autoFocus
                placeholder="1"
                placeholderTextColor="#CBD5E1"
                textAlign="center"
              />
              <Text style={styles.totalCalText}>
                Tổng năng lượng: <Text style={{ fontWeight: '900', color: '#111', fontSize: 24 }}>{(tempFood?.calories || 0) * (Number(quantityInput) || 0)}</Text> kcal
              </Text>

              <View style={{ flex: 1 }} />
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleConfirmAddFood} activeOpacity={0.85}>
                <Text style={styles.saveModalBtnText}>Thêm vào bữa ăn</Text>
              </TouchableOpacity>
              <View style={{ height: 30 }} />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#111' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 16 },

  typeSelector: { flexDirection: 'row', gap: 12, marginBottom: 35 },
  typeBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: '#FFF', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  activeTypeBtn: { backgroundColor: '#111', borderColor: '#111', shadowColor: '#111', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  typeText: { color: '#64748B', fontWeight: '700', fontSize: 14 },
  activeTypeText: { color: '#D4F93D', fontWeight: '800', fontSize: 14 },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },

  foodsContainer: { paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', borderStyle: 'dashed' },
  emptyText: { color: '#94A3B8', fontWeight: '600', textAlign: 'center', marginTop: 12, paddingHorizontal: 40, lineHeight: 22 },

  foodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#F8FAFC' },
  foodIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' },
  foodName: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 4 },
  foodDetails: { color: '#64748B', fontWeight: '600', fontSize: 13 },
  deleteBtn: { padding: 8 },

  addFoodBigBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 20, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  addFoodBigText: { marginLeft: 8, fontWeight: '800', fontSize: 15, color: '#111' },

  footer: { paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 20 : 40, paddingTop: 10, backgroundColor: '#FAFAFA' },
  saveButton: { backgroundColor: '#D4F93D', paddingVertical: 18, borderRadius: 30, alignItems: 'center', shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  saveButtonText: { color: '#111', fontSize: 17, fontWeight: '900' },

  // MODAL
  modalContainer: { flex: 1, backgroundColor: '#FAFAFA' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, backgroundColor: '#FAFAFA' },
  modalIconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  modalContent: { paddingHorizontal: 20, paddingTop: 10, flex: 1 },

  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  searchInput: { flex: 1, padding: 16, fontSize: 16, color: '#111', fontWeight: '500' },

  createNewBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 16, borderRadius: 20, marginBottom: 25, shadowColor: '#111', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  createIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#D4F93D', justifyContent: 'center', alignItems: 'center' },
  createNewBtnText: { marginLeft: 12, fontWeight: '800', fontSize: 15, color: '#FFF' },

  searchResultItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  searchFoodIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  searchResultName: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 4 },
  searchResultCal: { color: '#64748B', fontWeight: '600', fontSize: 13 },
  emptySearchText: { textAlign: 'center', color: '#94A3B8', marginTop: 30, fontWeight: '600' },

  formCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  inputLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#475569', marginTop: 12 },
  inputField: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, fontSize: 16, color: '#111', fontWeight: '600' },
  inputFieldSm: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, fontSize: 15, color: '#111', fontWeight: '600', textAlign: 'center' },

  saveModalBtn: { backgroundColor: '#D4F93D', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 30, shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  saveModalBtnText: { color: '#111', fontWeight: '900', fontSize: 17 },

  quantityCard: { backgroundColor: '#FFF', padding: 30, borderRadius: 24, alignItems: 'center', marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  qtyIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  quantityFoodName: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 8, textAlign: 'center' },
  quantityMacros: { color: '#64748B', fontSize: 15, fontWeight: '600' },

  qtyInputField: { backgroundColor: '#FFF', padding: 16, borderRadius: 20, fontSize: 36, fontWeight: '900', color: '#111', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9', marginVertical: 10 },
  totalCalText: { fontSize: 15, textAlign: 'center', marginTop: 20, color: '#64748B', fontWeight: '600' }
});