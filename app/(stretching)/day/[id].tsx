import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { stretchingData } from "../data";

export default function DayMissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const day = stretchingData.find((d) => d.id === id);
  const [completed, setCompleted] = useState<number[]>([]);

  if (!day) return <SafeAreaView style={styles.container}><Text style={styles.notFoundText}>Không tìm thấy dữ liệu.</Text></SafeAreaView>;

  const toggleStation = (stationId: number) => {
    if (completed.includes(stationId)) {
      setCompleted(completed.filter((c) => c !== stationId));
    } else {
      setCompleted([...completed, stationId]);
    }
  };

  const isAllCompleted = completed.length === day.stations.length;
  const points = completed.length * 10 + (isAllCompleted ? 40 : 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{day.dayName}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.themeInfo}>
          <Text style={styles.themeSubtitle}>Chủ đề hôm nay:</Text>
          <Text style={styles.themeTitle}>{day.theme}</Text>
        </View>

        {/* PROGRESS BANNER */}
        <View style={[styles.progressCard, isAllCompleted && styles.progressCardComplete]}>
           <View style={styles.progressRow}>
              <View>
                 <Text style={styles.progressLabel}>TỔNG ĐIỂM NGÀY</Text>
                 <Text style={styles.pointsText}>{points} / 100 ĐIỂM</Text>
              </View>
              {isAllCompleted ? (
                 <View style={styles.perfectBadge}>
                    <Ionicons name="star" size={16} color="#000" />
                    <Text style={styles.perfectBadgeText}>HOÀN HẢO</Text>
                 </View>
              ) : (
                 <View style={styles.circleProgressBg}>
                    <Text style={styles.circleProgressText}>{completed.length}/6</Text>
                 </View>
              )}
           </View>
           
           <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(points / 100) * 100}%` }]} />
           </View>
        </View>

        {/* STATIONS LIST */}
        <View style={styles.stationsList}>
          {day.stations.map((station) => {
            const isDone = completed.includes(station.id);
            return (
              <TouchableOpacity
                key={station.id}
                style={[styles.stationCard, isDone && styles.stationCardDone]}
                activeOpacity={0.8}
                onPress={() => toggleStation(station.id)}
              >
                <View style={styles.stationHeader}>
                  <View style={styles.stationTitleRow}>
                    <View style={[styles.stationBadge, isDone && {backgroundColor: '#D4F93D'}]}>
                      <Text style={[styles.stationBadgeText, isDone && {color: '#111'}]}>+{station.reward}Đ</Text>
                    </View>
                    <Text style={styles.stationTitle}>{station.title}</Text>
                  </View>
                  
                  <View style={[styles.checkbox, isDone && styles.checkboxActive]}>
                    {isDone && <Ionicons name="checkmark" size={16} color="#111" />}
                  </View>
                </View>

                <View style={styles.stationContent}>
                  <View style={styles.activityRow}>
                    <Ionicons name="time" size={16} color="#A1A1AA" />
                    <Text style={styles.activityText}>{station.activity}</Text>
                  </View>
                  <View style={styles.missionRow}>
                    <Ionicons name="flash" size={16} color="#D4F93D" />
                    <Text style={styles.missionText}>{station.mission}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  notFoundText: { color: '#FFF', fontSize: 18, textAlign: 'center', marginTop: 50 },
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
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#FFF", textTransform: 'uppercase' },
  
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  
  themeInfo: { marginBottom: 24 },
  themeSubtitle: { color: '#A1A1AA', fontSize: 15, fontWeight: '600', marginBottom: 6 },
  themeTitle: { fontSize: 32, fontWeight: '900', color: '#FFF', letterSpacing: -1 },

  progressCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  progressCardComplete: {
    borderColor: '#D4F93D',
    backgroundColor: 'rgba(212, 249, 61, 0.05)',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressLabel: { color: '#A1A1AA', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  pointsText: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  circleProgressBg: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  circleProgressText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  perfectBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D4F93D', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  perfectBadgeText: { color: '#111', fontSize: 13, fontWeight: '800' },

  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#D4F93D', borderRadius: 4 },

  stationsList: { gap: 16 },
  stationCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  stationCardDone: {
    borderColor: 'rgba(212, 249, 61, 0.3)',
    backgroundColor: 'rgba(212, 249, 61, 0.02)',
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stationBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stationBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  stationTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  
  checkbox: {
    width: 28, height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#D4F93D',
    borderColor: '#D4F93D',
  },

  stationContent: { gap: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  activityText: { color: '#A1A1AA', fontSize: 15, flex: 1, lineHeight: 22 },
  
  missionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  missionText: { color: '#E4E4E7', fontSize: 15, flex: 1, lineHeight: 22, fontWeight: '600' },
});
