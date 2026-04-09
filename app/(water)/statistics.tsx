import { getWaterLogByDay, getWaterSettings } from '@/api/waterApi';
import { useUser } from '@/hooks/auth/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DayData {
  dateString: string;
  label: string;
  shortDate: string;
  value: number;
}

export default function WaterStatisticsScreen() {
  const router = useRouter();
  const { user } = useUser();
  
  const [weekOffset, setWeekOffset] = useState(0); // 0 = origin
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState<number>(2000); // Mặc định nếu không call được set

  const getWeekDates = (offset: number) => {
    // Để giữ múi giờ chuẩn của máy hiện tại, ta tính các toán hạng ngày qua hệ số thời gian (Epoch)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt về chuẩn đầu ngày

    const currentDay = today.getDay(); 
    // Javascript Day: 0 là CN, 1 là T2
    // Đảo lại để CN nằm vào vị trí số 6
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
    
    // Tính khoảng lùi tương đối từ Ngày thứ Hai
    const monday = new Date(today.setDate(diff + (offset * 7)));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dateStr = String(d.getDate()).padStart(2, '0');
        
        week.push({
            dateString: `${year}-${month}-${dateStr}`,
            label: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i],
            shortDate: `${dateStr}/${month}`,
            value: 0
        });
    }
    return week;
  };

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchWeekData = async () => {
      setLoading(true);
      try {
        // Fetch goal cho trần biểu đồ
        if (goal === 2000) {
          const settings = await getWaterSettings(user.id);
          if (settings?.data?.daily_goal_ml) {
             setGoal(settings.data.daily_goal_ml);
          }
        }
        
        const weekDates = getWeekDates(weekOffset);
        
        // Gọi Promise.all tải song song 7 ngày
        const promises = weekDates.map(d => getWaterLogByDay(user.id, d.dateString));
        const results = await Promise.all(promises);
        
        // Đếm cục ml
        const sums = results.map(res => {
           const items = res?.data || res || [];
           let total = 0;
           if (Array.isArray(items)) {
              items.forEach(log => { total += log.amount_ml || 0; });
           }
           return total;
        });
        
        setWeekData(weekDates.map((d, index) => ({
           ...d,
           value: sums[index]
        })));
        
      } catch (e) {
        console.log("Error fetching stats:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeekData();
  }, [user?.id, weekOffset]);

  const handlePrevWeek = () => setWeekOffset(w => w - 1);
  const handleNextWeek = () => setWeekOffset(w => w + 1);

  // Định tuyến tính chiều cao BAR Chart
  const maxValue = Math.max(goal, ...weekData.map(d => d.value));
  // Tuỳ chỉnh trần biểu đồ cho đỡ sát mép
  const chartCeiling = maxValue > goal ? maxValue + 500 : goal + 200;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={28} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê uống nước</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* WEEK NAVIGATOR */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={handlePrevWeek} style={styles.navBtn}>
             <Ionicons name="chevron-back" size={24} color="#0EA5E9" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>
             {weekData.length > 0 ? `${weekData[0].shortDate} - ${weekData[6].shortDate}` : 'Đang tải...'}
          </Text>
          <TouchableOpacity 
             onPress={handleNextWeek} 
             style={[styles.navBtn, weekOffset === 0 && { opacity: 0.3 }]}
             disabled={weekOffset === 0} // Tuần hiện tại là Max, không thể tới tương lai!
          >
             <Ionicons name="chevron-forward" size={24} color="#0EA5E9" />
          </TouchableOpacity>
        </View>

        {/* Biểu đồ khối Chart Base */}
        <View style={styles.chartCardWrapper}>
           {loading ? (
             <View style={styles.loadingWrapper}>
               <ActivityIndicator size="large" color="#0EA5E9" />
               <Text style={{ marginTop: 10, color: '#64748B' }}>Đang nạp 7 ngày...</Text>
             </View>
           ) : (
             <View style={styles.chartContainer}>
                 {/* Các vạch đứt đại diện cho vạch Goal */}
                 <View style={styles.goalLineWrapper}>
                    <View style={[styles.goalLine, { bottom: `${(goal / chartCeiling) * 100}%` }]} />
                    <Text style={[styles.goalLineLabel, { bottom: `${(goal / chartCeiling) * 100}%` }]}>Mục tiêu</Text>
                 </View>
                 
                 <View style={styles.barsContainer}>
                   {weekData.map((d, index) => {
                     // Tính toán 100% cột sẽ chiếm theo tỷ lệ trên thanh công cụ
                     const fillRatio = (d.value / chartCeiling) * 100;
                     const isSurpassed = d.value >= goal;

                     return (
                        <View key={index} style={styles.barColumn}>
                          <Text style={styles.barValueText} numberOfLines={1}>{d.value > 0 ? d.value : ''}</Text>
                          <View style={styles.barOuter}>
                            <View style={[
                              styles.barInner, 
                              { height: `${fillRatio}%` },
                              isSurpassed ? { backgroundColor: '#0284C7' } : null // Đạt kpi đổi màu nhấn mạnh
                            ]} />
                          </View>
                          <Text style={[styles.barDayText, d.dateString === new Date().toISOString().split('T')[0] && styles.todayText]}>
                             {d.label}
                          </Text>
                        </View>
                     );
                   })}
                 </View>
             </View>
           )}
        </View> 

        <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Mục tiêu mốc</Text>
              <Text style={styles.summaryValueGoal}>{goal} mL</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng tuần này</Text>
              <Text style={styles.summaryValueMain}>{weekData.reduce((acc, curr) => acc + curr.value, 0)} mL</Text>
            </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', paddingTop: 10, paddingBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  backBtn: { padding: 4 },
  
  content: { paddingHorizontal: 20, paddingTop: 20 },
  
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  navTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },
  navBtn: { padding: 8, backgroundColor: '#F0F9FF', borderRadius: 12 },

  chartCardWrapper: { width: '100%', height: 320, backgroundColor: '#FFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 8, marginBottom: 20 },
  loadingWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  chartContainer: { flex: 1, position: 'relative' },
  goalLineWrapper: { position: 'absolute', top: 0, bottom: 25, left: 0, right: 0, zIndex: 0 }, // Không chứa text label
  goalLine: { position: 'absolute', left: 0, right: 0, height: 2, borderBottomWidth: 1, borderBottomColor: '#CBD5E1', borderStyle: 'dashed', opacity: 0.5 },
  goalLineLabel: { position: 'absolute', right: 0, color: '#94A3B8', fontSize: 10, fontWeight: '600', paddingBottom: 2 },
  
  barsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 5, zIndex: 1 },
  barColumn: { alignItems: 'center', width: 34, height: '100%', justifyContent: 'flex-end' },
  barValueText: { fontSize: 10, color: '#0EA5E9', fontWeight: '800', marginBottom: 4, height: 16 },
  barOuter: { width: 22, height: '80%', backgroundColor: '#F1F5F9', borderRadius: 12, justifyContent: 'flex-end', overflow: 'hidden' },
  barInner: { width: '100%', backgroundColor: '#38BDF8', borderRadius: 12 },
  barDayText: { fontSize: 12, fontWeight: '700', color: '#64748B', marginTop: 10 },
  todayText: { color: '#0284C7', fontWeight: '900' },

  summaryBox: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 5 },
  summaryItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  summaryDivider: { width: 1, height: '100%', backgroundColor: '#E2E8F0', marginHorizontal: 15 },
  summaryLabel: { fontSize: 13, color: '#64748B', fontWeight: '600', marginBottom: 8 },
  summaryValueGoal: { fontSize: 20, color: '#334155', fontWeight: '800' },
  summaryValueMain: { fontSize: 22, color: '#0EA5E9', fontWeight: '900' },
});
