// app/nutrition/log.tsx

import { useUser } from '@/hooks/auth/useUser';
import { useMeal } from '@/hooks/notrition/useMeal';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Image, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AiChatModal from './AiChatModal';

export default function MyMealsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER'>('BREAKFAST');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { dailyMeals, loading: mealLoading, fetchDailyMeals } = useMeal();
  const { user, loading: userLoading } = useUser();

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

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
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} activeOpacity={0.8}>
            <Ionicons name="arrow-back-outline" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nhật Ký Bữa Ăn</Text>
          <TouchableOpacity onPress={() => router.push('/(nutrition)/add')} style={styles.iconBtnAdd} activeOpacity={0.85}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
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
            getItemLayout={(data, index) => ({ length: 70, offset: 70 * index, index })}
            renderItem={({ item }) => {
              const isActive = selectedDate === item.fullDate;
              return (
                <TouchableOpacity
                  style={[styles.dateBox, isActive && styles.activeDateBox]}
                  onPress={() => setSelectedDate(item.fullDate)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dateMonthText, isActive && { color: '#94A3B8' }]}>{item.month}</Text>
                  <Text style={[styles.dateDayText, isActive && { color: '#D4F93D' }]}>{item.day}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryTitle}>Tổng năng lượng</Text>
              <Text style={styles.summaryCal}>{dailyMeals?.total_calories_of_day || 0} <Text style={{ fontSize: 16, color: '#9CA3AF' }}>kcal</Text></Text>
            </View>
            <View style={styles.summaryFire}>
              <Ionicons name="flame" size={32} color="#D4F93D" />
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {(['BREAKFAST', 'LUNCH', 'DINNER'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
                {tab === 'BREAKFAST' ? 'Sáng' : tab === 'LUNCH' ? 'Trưa' : 'Tối'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {(mealLoading || userLoading) ? (
          <ActivityIndicator size="large" color="#111" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
            {foodsToDisplay.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="restaurant-outline" size={40} color="#CBD5E1" />
                <Text style={styles.emptyText}>Chưa có món ăn nào cho bữa này.</Text>
                <TouchableOpacity style={styles.emptyAddBtn} onPress={() => router.push('/(nutrition)/add')}>
                  <Text style={styles.emptyAddBtnText}>Thêm món ăn ngay</Text>
                </TouchableOpacity>
              </View>
            ) : (
              foodsToDisplay.map((item: any, index: number) => (
                <View key={item.log_id || index} style={styles.foodCard}>
                  <View style={styles.foodHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={styles.foodIconWrap}><Ionicons name="nutrition" size={18} color="#0EA5E9" /></View>
                      <Text style={styles.foodName}>{item.food_name}</Text>
                    </View>
                    <TouchableOpacity style={styles.moreBtn}>
                      <Ionicons name="ellipsis-horizontal" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.macros}>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{item.quantity}</Text>
                      <Text style={styles.macroLabel}>Số phần</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{item.calories} <Text style={{ fontSize: 12, fontWeight: '600' }}>kcal</Text></Text>
                      <Text style={styles.macroLabel}>Năng lượng</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </SafeAreaView>

      {/* NÚT LINH VẬT ROBOT*/}
      <Animated.View
        style={[styles.aiMascotFloating, { transform: pan.getTranslateTransform() }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={{ width: '100%', height: '100%' }}
          onPress={() => setIsChatOpen(true)}
          activeOpacity={0.8}
        >
          <Image
            source={require('@/assets/images/AI.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={12} color="#111" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <AiChatModal visible={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', paddingTop: 10, paddingBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  iconBtnAdd: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', shadowColor: '#111', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },

  dateScroll: { paddingHorizontal: 20, marginTop: 5, maxHeight: 85, flexGrow: 0 },
  dateBox: { width: 55, height: 75, backgroundColor: '#FFF', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  activeDateBox: { backgroundColor: '#111', shadowColor: '#111', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  dateMonthText: { fontSize: 13, fontWeight: '700', color: '#94A3B8', marginBottom: 4 },
  dateDayText: { fontSize: 18, fontWeight: '900', color: '#111' },

  summaryCard: { backgroundColor: '#111', margin: 20, padding: 24, borderRadius: 24, shadowColor: '#111', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { color: '#9CA3AF', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  summaryCal: { color: '#D4F93D', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  summaryFire: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(212, 249, 61, 0.1)', justifyContent: 'center', alignItems: 'center' },

  tabsContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', marginHorizontal: 20, borderRadius: 20, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 16 },
  activeTab: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  tabText: { color: '#64748B', fontWeight: '700', fontSize: 13 },
  activeTabText: { color: '#111', fontWeight: '800', fontSize: 13 },

  foodList: { padding: 20 },
  emptyCard: { alignItems: 'center', padding: 30, backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', borderStyle: 'dashed' },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 15, fontWeight: '600', fontSize: 14, marginBottom: 20 },
  emptyAddBtn: { backgroundColor: '#111', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20 },
  emptyAddBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },

  foodCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, borderColor: '#F8FAFC', borderWidth: 1, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  foodIconWrap: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  foodName: { fontSize: 16, fontWeight: '800', color: '#111' },
  moreBtn: { padding: 4 },

  macros: { flexDirection: 'row', gap: 12 },
  macroBox: { flex: 1, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16 },
  macroValue: { fontWeight: '900', fontSize: 18, color: '#111', marginBottom: 2 },
  macroLabel: { color: '#64748B', fontSize: 12, fontWeight: '600' },

  // STYLE CHO NÚT LINH VẬT NỔI
  aiMascotFloating: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  aiBadge: { position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: '#D4F93D', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' }
});