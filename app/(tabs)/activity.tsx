import { useUser } from '@/hooks/auth/useUser';
import { useWaterProgress } from '@/hooks/water/useWaterProgress';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityScreen() {
  const router = useRouter();

  const { user } = useUser();
  const { progress, fetchProgress } = useWaterProgress();

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchProgress(user.id);
      }
    }, [user?.id, fetchProgress])
  );

  const waterPercent = progress ? Math.min(progress.percentage, 100) : 0;

  const now = new Date();
  const currentDayNum = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

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
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hoạt động</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="calendar-outline" size={24} color="#111" />
          </TouchableOpacity>
        </View>

        <Text style={styles.monthTitle}>Tháng {currentMonth}, {currentYear}</Text>

        {/* CALENDAR STRIP */}
        <View style={styles.calendarStrip}>
          {DATES.map((item, index) => (
            <View key={index} style={[styles.dateBox, item.active && styles.activeDateBox]}>
              <Text style={[styles.dayText, item.active && styles.activeDayText]}>{item.d}</Text>
              <Text style={[styles.numText, item.active && styles.activeNumText]}>{item.n}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tổng quan hôm nay</Text>
        </View>

        {/* CÁC THẺ STATS */}
        <View style={styles.statsRow}>
          {/* THỜI GIAN TẬP */}
          <View style={styles.timeCard}>
            <View style={styles.timeHeader}>
              <Ionicons name="fitness" size={20} color="#8B5CF6" />
              <Text style={styles.timeTitle}>Thời gian tập</Text>
            </View>
            <View style={styles.circleGraphContainer}>
              <View style={styles.circleGraph}>
                <Text style={styles.percentText}>80%</Text>
                <Text style={styles.goalText}>Mục tiêu</Text>
              </View>
            </View>
            <View style={styles.timeFooter}>
              <Text style={styles.timeValueText}>45</Text>
              <Text style={styles.timeUnitText}>phút</Text>
            </View>
          </View>

          {/* NÚT UỐNG NƯỚC */}
          <TouchableOpacity
            style={styles.waterCard}
            onPress={() => router.push('/(water)')}
            activeOpacity={0.8}
          >
            <View style={styles.waterHeader}>
              <Ionicons name="water" size={20} color="#0EA5E9" />
              <Text style={styles.waterTitle}>Nước uống</Text>
            </View>

            <View style={styles.waterContent}>
              <MaterialCommunityIcons name="cup-water" size={40} color="#0EA5E9" style={styles.waterIconBig} />
              <View>
                <Text style={styles.waterValue}>{progress?.consumed_ml || 0} <Text style={styles.waterUnit}>mL</Text></Text>
              </View>
            </View>

            <View style={styles.waterFooter}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Tiến độ</Text>
                <Text style={styles.progressPercent}>{waterPercent}%</Text>
              </View>
              {/* Thanh Progress Bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${waterPercent}%` }]} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* LEADERBOARD ENTRY */}
        <View style={styles.sectionHeaderLeaderboard}>
          <Text style={styles.sectionTitle}>Bảng xếp hạng</Text>
        </View>

        <TouchableOpacity
          style={styles.leaderboardEntryCard}
          activeOpacity={0.8}
          onPress={() => router.push('/leaderboard')}
        >
          <View style={styles.leaderboardEntryLeft}>
            <View style={styles.leaderboardIconBg}>
              <Ionicons name="trophy" size={24} color="#FBBF24" />
            </View>
            <View>
              <Text style={styles.leaderboardEntryTitle}>Đường đua rèn luyện</Text>
              <Text style={styles.leaderboardEntryDesc}>Xem thứ hạng của bạn</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#A1A1AA" />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#111", letterSpacing: -0.5 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },

  monthTitle: { fontSize: 16, fontWeight: "700", color: "#64748B", marginBottom: 16 },

  calendarStrip: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  dateBox: { flex: 1, height: 68, borderRadius: 16, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", marginHorizontal: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 2 },
  activeDateBox: { backgroundColor: "#111", shadowColor: "#111", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  dayText: { fontSize: 12, fontWeight: "600", color: "#94A3B8" },
  activeDayText: { color: "#FFF" },
  numText: { fontSize: 16, fontWeight: "800", color: "#111", marginTop: 4 },
  activeNumText: { color: "#D4F93D" },

  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#111" },

  statsRow: { flexDirection: "row", gap: 16 },

  timeCard: { flex: 1, backgroundColor: "#FFF", borderRadius: 24, padding: 16, height: 220, justifyContent: 'space-between', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  timeHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeTitle: { fontSize: 14, fontWeight: "700", color: "#64748B" },
  circleGraphContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  circleGraph: { width: 100, height: 100, borderRadius: 50, borderWidth: 8, borderColor: "#E2E8F0", borderTopColor: "#8B5CF6", borderRightColor: "#8B5CF6", justifyContent: 'center', alignItems: 'center', shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  percentText: { fontSize: 20, fontWeight: "900", color: "#111" },
  goalText: { fontSize: 10, fontWeight: "600", color: "#94A3B8", marginTop: 2 },
  timeFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4 },
  timeValueText: { fontSize: 24, fontWeight: '900', color: '#111' },
  timeUnitText: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 4 },

  waterCard: { flex: 1, backgroundColor: "#F0F9FF", borderRadius: 24, padding: 16, height: 220, justifyContent: 'space-between', shadowColor: "#0EA5E9", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: "#E0F2FE" },
  waterHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  waterTitle: { fontSize: 14, fontWeight: "700", color: "#0284C7" },
  waterContent: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  waterIconBig: { marginBottom: 8, opacity: 0.9 },
  waterValue: { fontSize: 26, fontWeight: '900', color: '#0284C7' },
  waterUnit: { fontSize: 14, fontWeight: '700' },
  waterFooter: { width: '100%' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: '#0284C7', fontWeight: '600' },
  progressPercent: { fontSize: 14, fontWeight: '800', color: '#0284C7' },
  progressBarBg: { height: 8, backgroundColor: '#BAE6FD', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0EA5E9', borderRadius: 4 },

  sectionHeaderLeaderboard: { marginTop: 32, marginBottom: 16 },
  leaderboardEntryCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  leaderboardEntryLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  leaderboardIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
  leaderboardEntryTitle: { color: '#111', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  leaderboardEntryDesc: { color: '#64748B', fontSize: 13, fontWeight: '600' },
});