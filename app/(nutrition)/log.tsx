import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 1. Thay đổi nguồn import SafeAreaView sang thư viện chuyên dụng
import { SafeAreaView } from 'react-native-safe-area-context';

// Dữ liệu mẫu để hiển thị
const dummyFoods = [
  { id: '1', name: 'Salad with eggs', calories: 294, protein: 12, fat: 22, carbs: 42 },
  { id: '2', name: 'Avocado Dish', calories: 294, protein: 12, fat: 32, carbs: 12 },
];

export default function MyMealsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Breakfast');

  return (
    // 2. Thêm thuộc tính edges={['top']} để nó chỉ đẩy phần trên (tránh che tai thỏ)
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Meals</Text>
        <View style={styles.headerActions}>
          {/* Sửa lại đường dẫn tránh lỗi Router cũ */}
          <TouchableOpacity onPress={() => router.push('/(nutrition)/add')}>
            <Ionicons name="add-circle-outline" size={28} color="#8DC63F" style={{marginRight: 15}} />
          </TouchableOpacity>
          <Ionicons name="share-social-outline" size={28} color="#8DC63F" />
        </View>
      </View>

      {/* Lịch (Giả lập) */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {['Aug 10', 'Aug 11', 'Aug 12', 'Aug 13'].map((date, index) => (
            <View key={index} style={[styles.dateBox, date === 'Aug 12' && styles.activeDateBox]}>
              <Text style={[styles.dateText, date === 'Aug 12' && {color: '#fff'}]}>{date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Tabs Bữa ăn */}
      <View style={styles.tabsContainer}>
        {(['Breakfast', 'Lunch', 'Dinner'] as const).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách món ăn */}
      <ScrollView style={styles.foodList}>
        {dummyFoods.map(food => (
            <View key={food.id} style={styles.foodCard}>
            <View style={styles.foodHeader}>
                <Text style={styles.foodName}>🍳 {food.name}</Text>
                <Ionicons name="ellipsis-horizontal" size={20} color="#8DC63F" />
            </View>
            <Text style={styles.foodCal}>🔥 {food.calories} kcal - 100g</Text>
            
            <View style={styles.macros}>
                <View><Text style={styles.macroValue}>{food.protein}g</Text><Text style={styles.macroLabel}>Protein</Text></View>
                <View><Text style={styles.macroValue}>{food.fat}g</Text><Text style={styles.macroLabel}>Fats</Text></View>
                <View><Text style={styles.macroValue}>{food.carbs}g</Text><Text style={styles.macroLabel}>Carbs</Text></View>
            </View>
            </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', paddingTop: 15, paddingBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row' },
  dateScroll: { paddingHorizontal: 20, marginTop: 15, maxHeight: 70, flexGrow: 0 },
  dateBox: { width: 60, height: 60, backgroundColor: '#F0F0F0', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  activeDateBox: { backgroundColor: '#F27B35' },
  dateText: { fontWeight: 'bold', color: '#888' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#F0F0F0', marginHorizontal: 20, borderRadius: 25, marginTop: 25 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { color: '#888', fontWeight: 'bold' },
  activeTabText: { color: '#000', fontWeight: 'bold' },
  foodList: { padding: 20 },
  foodCard: { backgroundColor: '#fff', padding: 16, borderRadius: 20, borderColor: '#E8F5E9', borderWidth: 2, marginBottom: 15 },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  foodName: { fontSize: 16, fontWeight: 'bold' },
  foodCal: { color: '#888', fontSize: 12, marginTop: 5 },
  macros: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingHorizontal: 10 },
  macroValue: { fontWeight: 'bold', fontSize: 14 },
  macroLabel: { color: '#888', fontSize: 12 },
});