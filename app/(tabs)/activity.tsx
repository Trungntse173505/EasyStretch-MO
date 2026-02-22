import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityScreen() {
  // 1. Lấy thông tin thời gian hiện tại
  const now = new Date();
  const currentDayNum = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // 2. Hàm tạo danh sách 7 ngày trong tuần
  const generateDates = () => {
    const dates = [];
    const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(startOfWeek);
      tempDate.setDate(startOfWeek.getDate() + i);
      
      dates.push({
        d: dayLabels[tempDate.getDay()],
        n: tempDate.getDate().toString(),
        active: tempDate.getDate() === currentDayNum && tempDate.getMonth() === now.getMonth(),
      });
    }
    return dates;
  };

  const DATES = generateDates();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Activity</Text>

        <Text style={styles.monthTitle}>Tháng {currentMonth} năm {currentYear}</Text>

        {/* CALENDAR STRIP */}
        <View style={styles.calendarStrip}>
          {DATES.map((item, index) => (
            <View key={index} style={[styles.dateBox, item.active && styles.activeDateBox]}>
              <Text style={[styles.dayText, item.active && styles.activeText]}>{item.d}</Text>
              <Text style={[styles.numText, item.active && styles.activeText]}>{item.n}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Hôm nay</Text>

        {/* Các phần Stats bên dưới giữ nguyên logic UI của bạn */}
        <View style={styles.statsRow}>
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepLabel}>Cố lên nào! 💪</Text>
            </View>
            <View style={styles.stepContent}>
              <Ionicons name="footsteps" size={24} color="#111" style={{marginBottom: 8}} />
              <Text style={styles.stepValue}>Bước đi</Text>
              <Text style={styles.stepNum}>999/2000</Text>
            </View>
          </View>

          <View style={styles.timeCard}>
            <Text style={styles.timeLabel}>Thời gian tập</Text>
            <View style={styles.circleGraph}>
               <Text style={styles.percentText}>80%</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
           <View style={[styles.smallCard, { backgroundColor: "#F3E8FF" }]}>
              <View style={{flexDirection:'row', alignItems:'center', gap: 6, marginBottom: 8}}>
                 <Ionicons name="moon" size={16} color="#7C3AED" />
                 <Text style={{fontWeight:'700', color:'#4C1D95'}}>Giấc ngủ</Text>
              </View>
              <View style={{flexDirection:'row', alignItems:'flex-end', gap: 4, height: 30}}>
                 {[2,4,3,5,2,4,5].map((h,i) => (
                    <View key={i} style={{width: 4, height: h*5, backgroundColor:'#7C3AED', borderRadius:2}} />
                 ))}
              </View>
           </View>

           <View style={[styles.smallCard, { backgroundColor: "#E0F2FE" }]}>
              <View style={{flexDirection:'row', alignItems:'center', gap: 6, marginBottom: 8}}>
                 <Ionicons name="water" size={16} color="#0284C7" />
                 <Text style={{fontWeight:'700', color:'#0C4A6E'}}>Uống nước</Text>
              </View>
              <View style={{backgroundColor:'#fff', borderRadius:10, padding: 4}}>
                 <Text style={{fontSize: 10, fontWeight:'700', color:'#0284C7', textAlign:'center'}}>6/8 cốc nước</Text>
              </View>
           </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: "600", color: "#000000" },
  monthTitle: { fontSize: 20, fontWeight: "800", color: "#6e6969", marginVertical: 10 },
  calendarStrip: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  dateBox: { width: 40, height: 60, borderRadius: 20, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  activeDateBox: { backgroundColor: "#111" },
  dayText: { fontSize: 12, fontWeight: "600", color: "#111" },
  numText: { fontSize: 14, fontWeight: "800", color: "#111", marginTop: 4 },
  activeText: { color: "#D4F93D" },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  stepCard: { flex: 1, backgroundColor: "#FFE4C4", borderRadius: 24, padding: 16, height: 180, justifyContent:'space-between' },
  stepHeader: { backgroundColor: "#fff", alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  stepLabel: { fontSize: 10, fontWeight: "700", color: "#F97316" },
  stepContent: { alignItems: 'flex-start' },
  stepValue: { fontSize: 16, fontWeight: "700", color: "#111" },
  stepNum: { fontSize: 20, fontWeight: "900", color: "#111", marginTop: 4 },
  timeCard: { flex: 1, backgroundColor: "#F3F4F6", borderRadius: 24, padding: 16, height: 180, alignItems: 'center' },
  timeLabel: { fontSize: 14, color: "#6B7280", marginBottom: 10 },
  circleGraph: { width: 100, height: 100, borderRadius: 50, borderWidth: 10, borderColor: "#A78BFA", justifyContent: 'center', alignItems: 'center' },
  percentText: { fontSize: 18, fontWeight: "800", color: "#111" },
  row: { flexDirection:'row', gap: 12 },
  smallCard: { flex: 1, borderRadius: 20, padding: 16, height: 100 },
});