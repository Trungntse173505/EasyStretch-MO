import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { stretchingData, DayMission } from "./data";

export default function StretchingDashboardScreen() {
  const router = useRouter();

  const phase1 = stretchingData.filter((d) => d.phase === 1);
  const phase2 = stretchingData.filter((d) => d.phase === 2);

  const renderDayCard = (day: DayMission) => (
    <TouchableOpacity
      key={day.id}
      style={styles.dayCard}
      activeOpacity={0.8}
      onPress={() => router.push(`/(stretching)/day/${day.id}`)}
    >
      <View style={styles.dayCardLeft}>
        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>{day.dayName}</Text>
        </View>
        <Text style={styles.dayTheme}>{day.theme}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhiệm Vụ Hàng Ngày</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HERO SECTION */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>GAME GIÃN CƠ</Text>
          <Text style={styles.heroSubtitle}>Hoàn thành các trạm để nhận 100 ĐIỂM mỗi ngày!</Text>
          <View style={styles.rewardBox}>
             <Ionicons name="trophy" size={20} color="#111" />
             <Text style={styles.rewardText}>Thưởng hoàn hảo: +40 ĐIỂM / ngày</Text>
          </View>
        </View>

        {/* PHASE 1 */}
        <View style={styles.phaseHeader}>
          <Ionicons name="briefcase" size={22} color="#D4F93D" />
          <Text style={styles.phaseTitle}>Giai Đoạn 1: Ngày Đi Làm</Text>
        </View>
        <View style={styles.cardsContainer}>
          {phase1.map(renderDayCard)}
        </View>

        {/* PHASE 2 */}
        <View style={[styles.phaseHeader, { marginTop: 30 }]}>
          <Ionicons name="cafe" size={22} color="#8B5CF6" />
          <Text style={[styles.phaseTitle, { color: '#8B5CF6' }]}>Giai Đoạn 2: Cuối Tuần</Text>
        </View>
        <View style={styles.cardsContainer}>
          {phase2.map(renderDayCard)}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" }, // Deep dark background
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: { 
    width: 44, height: 44, 
    borderRadius: 22, 
    backgroundColor: "rgba(255,255,255,0.1)", 
    justifyContent: "center", alignItems: "center" 
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#FFF" },
  
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  
  heroBanner: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(212, 249, 61, 0.2)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#D4F93D',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#A1A1AA',
    lineHeight: 22,
    marginBottom: 20,
  },
  rewardBox: {
    backgroundColor: '#D4F93D',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 14,
  },

  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#D4F93D',
    letterSpacing: -0.5,
  },

  cardsContainer: {
    gap: 12,
  },
  dayCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dayBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dayBadgeText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  dayTheme: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
