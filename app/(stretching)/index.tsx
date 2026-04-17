import { isStationNotifScheduled, scheduleStationNotifications } from "@/utils/stationNotificationHelper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY_LABELS_FULL = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

// Tạo danh sách 7 ngày của tuần hiện tại (T2 -> CN)
const getWeekDays = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const dayOfWeek = today.getDay(); // 0=CN, 1=T2,...
  // Tìm thứ 2 of current week
  const monday = new Date(today);
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    return {
      dateStr,
      dayIndex: (d.getDay() === 0 ? 7 : d.getDay()), // 1=T2 ... 7=CN
      dayName: DAY_LABELS_FULL[d.getDay()],
      shortName: DAY_NAMES[d.getDay()],
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
      isFuture: dateStr > todayStr,
    };
  });
};

export default function StretchingDashboardScreen() {
  const router = useRouter();
  const weekDays = getWeekDays();
  const today = new Date().toISOString().split('T')[0];
  const [showRules, setShowRules] = useState(false);

  // Schedule thông báo 6 mốc lần đầu user vào màn này
  useFocusEffect(
    useCallback(() => {
      const scheduleIfNeeded = async () => {
        const alreadyScheduled = await isStationNotifScheduled();
        if (!alreadyScheduled) {
          await scheduleStationNotifications();
        }
      };
      scheduleIfNeeded();
    }, [])
  );

  const handleDayPress = (dateStr: string) => {
    router.push({ pathname: '/(stretching)/day/[id]', params: { id: dateStr, date: dateStr } } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Left Action */}
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Center Title */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Nhiệm Vụ</Text>
        </View>

        {/* Header Right Actions */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.settingBtn}
            onPress={() => setShowRules(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="information-circle-outline" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingBtn}
            onPress={() => router.push('/(stretching)/settings')}
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* WEEKLY SCHEDULE */}
        <Text style={styles.sectionLabel}>📅 LỊCH TUẦN NÀY</Text>
        <View style={styles.weekContainer}>
          {weekDays.map((day) => {
            const isLocked = day.isPast || day.isFuture;
            return (
              <TouchableOpacity
                key={day.dateStr}
                style={[
                  styles.dayCard,
                  day.isToday && styles.dayCardToday,
                  isLocked && styles.dayCardLocked,
                ]}
                onPress={() => !isLocked && handleDayPress(day.dateStr)}
                activeOpacity={isLocked ? 1 : 0.75}
                disabled={isLocked}
              >
                {/* Top: ngày / icon */}
                <View style={styles.dayCardTop}>
                  <View style={[styles.dayBadge, day.isToday && styles.dayBadgeToday]}>
                    <Text style={[styles.dayBadgeText, day.isToday && styles.dayBadgeTextToday]}>
                      {day.shortName}
                    </Text>
                  </View>
                  {isLocked
                    ? <Ionicons name="lock-closed" size={18} color="rgba(255,255,255,0.2)" />
                    : <Ionicons name="flash" size={18} color="#D4F93D" />
                  }
                </View>

                {/* Số ngày */}
                <Text style={[styles.dayNumber, day.isToday && styles.dayNumberToday, isLocked && styles.dayNumberLocked]}>
                  {day.dayNumber}
                </Text>

                {/* Label */}
                <Text style={[styles.dayLabel, day.isToday && styles.dayLabelToday, isLocked && styles.dayLabelLocked]}>
                  {day.isToday ? 'Hôm nay' : day.dayName}
                </Text>

                {/* CTA */}
                {day.isToday && (
                  <View style={styles.ctaBtn}>
                    <Text style={styles.ctaBtnText}>Vào tập</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* RULES MODAL */}
      <Modal visible={showRules} transparent={true} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.rulesTitle}>📜 LUẬT CHƠI DÀNH CHO BẠN</Text>
              <TouchableOpacity onPress={() => setShowRules(false)} style={styles.closeModalBtn}>
                <Ionicons name="close" size={22} color="#A1A1AA" />
              </TouchableOpacity>
            </View>
            {[
              { icon: '✅', text: 'Hoàn thành mỗi bài tập để nhận +10 ĐIỂM' },
              { icon: '🎯', text: 'Mỗi ngày có 5 bài tập ở các mốc khác nhau' },
              { icon: '🔒', text: 'Chỉ có thể mở khóa vào đúng giờ quy định' },
              { icon: '🏆', text: 'Điểm tích lũy được ghi nhận lên bảng xếp hạng' },
            ].map((rule, i) => (
              <View key={i} style={styles.ruleRow}>
                <Text style={styles.ruleIcon}>{rule.icon}</Text>
                <Text style={styles.ruleText}>{rule.text}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.gotItBtn} onPress={() => setShowRules(false)}>
              <Text style={styles.gotItText}>ĐÃ HIỂU</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: { flex: 1, alignItems: 'flex-start' },
  headerCenter: { flex: 4, alignItems: 'center', marginLeft: 10 },
  headerRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 10 },

  backBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center", alignItems: "center"
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#FFF" },
  settingsBtnContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 10 },
  settingBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  content: { padding: 20 },

  rulesCard: {
    backgroundColor: '#161616',
    borderRadius: 20,
    padding: 20,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  rulesTitle: {
    fontSize: 14, color: '#D4F93D', fontWeight: '800', letterSpacing: 1,
    marginBottom: 16,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },

  weekContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  dayCard: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: '#161616',
    borderRadius: 20,
    padding: 16, // Giảm padding một chút để vừa nội dung
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  dayCardToday: {
    borderColor: '#D4F93D',
    backgroundColor: 'rgba(212,249,61,0.05)',
  },
  dayCardLocked: {
    opacity: 0.4,
  },

  dayCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayBadgeToday: { backgroundColor: 'rgba(212,249,61,0.2)' },
  dayBadgeText: { color: '#A1A1AA', fontWeight: '800', fontSize: 13 },
  dayBadgeTextToday: { color: '#D4F93D' },

  dayNumber: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  dayNumberToday: { color: '#D4F93D' },
  dayNumberLocked: { color: 'rgba(255,255,255,0.4)' },

  dayLabel: { fontSize: 15, fontWeight: '600', color: '#A1A1AA' },
  dayLabelToday: { color: '#FFF', fontWeight: '700' },
  dayLabelLocked: { color: 'rgba(255,255,255,0.3)' },

  ctaBtn: {
    marginTop: 16,
    backgroundColor: '#D4F93D',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaBtnText: { color: '#111', fontWeight: '900', fontSize: 15 },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 12 },
  ruleIcon: { fontSize: 20, width: 28 },
  ruleText: { flex: 1, fontSize: 15, color: '#A1A1AA', lineHeight: 22, fontWeight: '500' },

  // Modal styles
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  modalContent: {
    backgroundColor: '#161616', borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  closeModalBtn: { padding: 4 },
  gotItBtn: {
    backgroundColor: '#D4F93D', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 10
  },
  gotItText: { color: '#111', fontWeight: '900', fontSize: 15 },
});
