// app/nutrition/log.tsx

import { useUser } from '@/hooks/auth/useUser';
import { useMeal } from '@/hooks/notrition/useMeal';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AiChatModal from './AiChatModal';

export default function MyMealsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER'>('BREAKFAST');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { dailyMeals, loading: mealLoading, fetchDailyMeals } = useMeal();
  const { user, loading: userLoading } = useUser();

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchDailyMeals(user.id, selectedDate);
      }
    }, [selectedDate, user?.id, fetchDailyMeals])
  );

  const foodsToDisplay = dailyMeals?.[activeTab] || [];

  const dateList = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = -30; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' }); 
      const dayStr = d.getDate().toString();
      dates.push({ fullDate: dateString, month: monthStr, day: dayStr });
    }
    return dates;
  }, []);

  return (
    <View style={{ flex: 1 }}> 
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bữa ăn</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push('/(nutrition)/add')}>
              <Ionicons name="add-circle-outline" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thanh chọn ngày */}
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
            contentContainerStyle={{ paddingRight: 20 }}
            data={dateList}
            keyExtractor={(item) => item.fullDate}
            initialScrollIndex={30} 
            getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
            renderItem={({ item }) => {
              const isActive = selectedDate === item.fullDate;
              return (
                <TouchableOpacity 
                  style={[styles.dateBox, isActive && styles.activeDateBox]}
                  onPress={() => setSelectedDate(item.fullDate)}
                >
                  <Text style={[styles.dateMonthText, isActive && {color: '#fff'}]}>{item.month}</Text>
                  <Text style={[styles.dateDayText, isActive && {color: '#fff'}]}>{item.day}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tổng năng lượng</Text>
          <Text style={styles.summaryCal}>{dailyMeals?.total_calories_of_day || 0} kcal</Text>
        </View>

        <View style={styles.tabsContainer}>
          {(['BREAKFAST', 'LUNCH', 'DINNER'] as const).map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]} 
              onPress={() => setActiveTab(tab)}
            >
              <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
                {tab === 'BREAKFAST' ? 'Breakfast' : tab === 'LUNCH' ? 'Lunch' : 'Dinner'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {(mealLoading || userLoading) ? (
          <ActivityIndicator size="large" color="#F27B35" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView style={styles.foodList}>
            {foodsToDisplay.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có món ăn nào cho bữa này.</Text>
            ) : (
              foodsToDisplay.map((item: any, index: number) => (
                <View key={item.log_id || index} style={styles.foodCard}>
                  <View style={styles.foodHeader}>
                    <Text style={styles.foodName}>🍳 {item.food_name}</Text>
                    <TouchableOpacity>
                      <Ionicons name="ellipsis-horizontal" size={20} color="#ccc" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.foodCal}>🔥 {item.calories} kcal</Text>
                  <View style={styles.macros}>
                    <View>
                      <Text style={styles.macroValue}>{item.quantity}</Text>
                      <Text style={styles.macroLabel}>Số phần</Text>
                    </View>
                    <View>
                      <Text style={styles.macroValue}>{item.calories} kcal</Text>
                      <Text style={styles.macroLabel}>Năng lượng</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>

      {/* NÚT LINH VẬT ROBOT*/}
      <TouchableOpacity 
        style={styles.aiMascotFloating} 
        onPress={() => setIsChatOpen(true)}
        activeOpacity={0.8}
      >
        <Image 
          source={require('@/assets/images/AI.png')} 
          style={styles.mascotImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <AiChatModal visible={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', paddingTop: 15, paddingBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  
  dateScroll: { paddingHorizontal: 20, marginTop: 15, maxHeight: 80, flexGrow: 0 },
  dateBox: { width: 65, height: 75, backgroundColor: '#FFF', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
  activeDateBox: { backgroundColor: '#F27B35' }, 
  dateMonthText: { fontSize: 14, fontWeight: 'bold', color: '#888', marginBottom: 2 },
  dateDayText: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  summaryCard: { backgroundColor: '#111', margin: 20, padding: 20, borderRadius: 20, alignItems: 'center' },
  summaryTitle: { color: '#9CA3AF', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  summaryCal: { color: '#D4F93D', fontSize: 28, fontWeight: 'bold' },
  
  tabsContainer: { flexDirection: 'row', backgroundColor: '#F0F0F0', marginHorizontal: 20, borderRadius: 25 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { color: '#888', fontWeight: 'bold' },
  activeTabText: { color: '#000', fontWeight: 'bold' },
  
  foodList: { padding: 20 },
  foodCard: { backgroundColor: '#fff', padding: 16, borderRadius: 20, borderColor: '#F0F0F0', borderWidth: 1, marginBottom: 15 },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  foodCal: { color: '#888', fontSize: 12, marginTop: 5 },
  
  macros: { flexDirection: 'row', gap: 30, marginTop: 15, paddingHorizontal: 5 },
  macroValue: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  macroLabel: { color: '#888', fontSize: 12 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 30, fontStyle: 'italic' },

  // STYLE CHO NÚT LINH VẬT NỔI
  aiMascotFloating: {
    position: 'absolute',
    bottom: 40,
    right: 15,
    width: 85,
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    // Không có backgroundColor, chỉ đổ bóng để tạo độ nổi khối
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  }
});