import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MissionExercise } from "@/api/missionApi";
import { useMissions } from "@/hooks/mission/useMissions";
import { transformMediaUrl } from "@/utils/mediaUtils";
import { formatStationWindow, getStationByOrder, isStationUnlocked, isStationMissed, isStationFuture } from "../data";

const formatDuration = (seconds: number) => {
  if (seconds >= 60) return `${Math.floor(seconds / 60)} phút`;
  return `${seconds} giây`;
};

export default function DayMissionScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { missions, loading, error, fetchMissions, getCompletedExercises } = useMissions();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [now, setNow] = useState(new Date());

  // Cập nhật giờ mỗi 60 giây để tự mở khoá mốc khi tới giờ
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!date) return;
      const loadData = async () => {
        const data = await fetchMissions(date);
        if (data.length > 0) {
          const allExerciseIds = data.flatMap(m =>
            m.mission_exercises.map(me => me.exercise_id)
          );
          const done = await getCompletedExercises(date, allExerciseIds);
          setCompletedIds(done);
        }
      };
      loadData();
    }, [date, fetchMissions, getCompletedExercises])
  );

  // Gom tất cả exercises, sắp xếp theo order
  const allExercises: (MissionExercise & { mission_id: string })[] = missions
    .flatMap(mission =>
      mission.mission_exercises.map(me => ({ ...me, mission_id: mission.id }))
    )
    .sort((a, b) => a.order - b.order);

  const totalExercises = allExercises.length;
  const completedCount = allExercises.filter(e => completedIds.includes(e.exercise_id)).length;
  const totalPoints = completedCount * 10;
  const progressPercent = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  const displayDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('vi-VN', {
        weekday: 'long', day: 'numeric', month: 'numeric'
      })
    : '';

  const missionInfo = missions[0];

  const handlePlayExercise = (exercise: MissionExercise & { mission_id: string }) => {
    if (completedIds.includes(exercise.exercise_id)) return;
    const stationMeta = getStationByOrder(exercise.order);
    if (stationMeta && !isStationUnlocked(stationMeta, now)) return; // Chặn nếu ngoài giờ
    router.push({
      pathname: '/(stretching)/exercise-play',
      params: {
        mission_id: exercise.mission_id,
        exercise_id: exercise.exercise_id,
        title: exercise.exercises.title,
        station_name: stationMeta?.name || `Mốc ${exercise.order}`,
        station_icon: stationMeta?.icon || '🎯',
        duration: String(exercise.exercises.duration),
        img_url: exercise.exercises.img_list?.[0] || '',
        video_url: exercise.exercises.video_url || '',
        description: exercise.exercises.description || '',
        point: String(exercise.point),
        date,
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhiệm Vụ Hôm Nay</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#D4F93D" />
          <Text style={styles.loadingText}>Đang tải nhiệm vụ...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="warning-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* DATE & MISSION INFO */}
          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>{displayDate}</Text>
            {missionInfo && <Text style={styles.missionTitle}>{missionInfo.title}</Text>}
            {missionInfo?.description ? (
              <Text style={styles.missionDesc}>{missionInfo.description}</Text>
            ) : null}
          </View>

          {/* PROGRESS CARD */}
          <View style={[styles.progressCard, completedCount === totalExercises && totalExercises > 0 && styles.progressCardDone]}>
            <View style={styles.progressTop}>
              <View>
                <Text style={styles.progressLabel}>ĐIỂM TÍCH LŨY HÔM NAY</Text>
                <Text style={styles.progressPoints}>{totalPoints} ĐIỂM</Text>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressCircleText}>{completedCount}/{totalExercises}</Text>
                <Text style={styles.progressCircleSub}>Mốc</Text>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            {completedCount === totalExercises && totalExercises > 0 && (
              <View style={styles.completeBadge}>
                <Text style={styles.completeBadgeText}>🎉 HOÀN THÀNH TẤT CẢ HÔM NAY!</Text>
              </View>
            )}
          </View>

          {/* EXERCISE LIST */}
          {allExercises.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>😴</Text>
              <Text style={styles.emptyText}>Chưa có nhiệm vụ cho ngày này</Text>
            </View>
          ) : (
            <View style={styles.exerciseList}>
              {allExercises.map((exercise) => {
                const isDone = completedIds.includes(exercise.exercise_id);
                const imgUrl = exercise.exercises.img_list?.[0];
                const stationMeta = getStationByOrder(exercise.order);
                const timeWindow = stationMeta ? formatStationWindow(stationMeta) : '';

                // Logic ngày tháng
                const todayStr = new Date().toISOString().split('T')[0];
                const isPastDay = date < todayStr;
                const isFutureDay = date > todayStr;
                const isToday = date === todayStr;

                let isMissed = false;
                let isFuture = false;
                let unlocked = true;

                if (stationMeta) {
                  if (isPastDay) {
                    isMissed = !isDone;
                    unlocked = false;
                  } else if (isFutureDay) {
                    isFuture = true;
                    unlocked = false;
                  } else {
                    // Hôm nay
                    isMissed = !isDone && isStationMissed(stationMeta, now);
                    isFuture = !isDone && isStationFuture(stationMeta, now);
                    unlocked = isStationUnlocked(stationMeta, now);
                  }
                }

                // Nếu đã xong thì không quan tâm miss/future nữa
                const isLocked = !isDone && !unlocked && !isMissed;

                return (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[
                      styles.exerciseCard,
                      isDone && styles.exerciseCardDone,
                      (isLocked || isFuture) && styles.exerciseCardLocked,
                      isMissed && styles.exerciseCardMissed,
                    ]}
                    activeOpacity={isLocked || isDone || isMissed || isFuture ? 1 : 0.82}
                    onPress={() => handlePlayExercise(exercise)}
                  >
                    {/* Image */}
                    <View style={[styles.imgWrap, isLocked && styles.imgWrapLocked]}>
                      {imgUrl ? (
                        <Image source={{ uri: transformMediaUrl(imgUrl) || 'https://via.placeholder.com/200' }} style={styles.exerciseImg} />
                      ) : (
                        <View style={[styles.exerciseImg, styles.imgPlaceholder]}>
                          <Ionicons name={isLocked ? 'lock-closed' : 'fitness'} size={28} color={isLocked ? 'rgba(255,255,255,0.2)' : '#D4F93D'} />
                        </View>
                      )}
                      {/* Badge: số mốc / khoá / check */}
                      <View style={[
                        styles.orderBadge,
                        isDone && styles.orderBadgeDone,
                        (isLocked || isFuture) && styles.orderBadgeLocked,
                      ]}>
                        {isDone
                          ? <Ionicons name="checkmark" size={12} color="#111" />
                          : isMissed
                            ? <Ionicons name="close" size={14} color="#FFF" />
                            : (isLocked || isFuture)
                              ? <Ionicons name="lock-closed" size={10} color="rgba(255,255,255,0.4)" />
                              : <Text style={styles.orderText}>{exercise.order}</Text>
                        }
                      </View>
                    </View>

                    {/* Info */}
                    <View style={styles.exerciseInfo}>
                      {/* Station name & Status Badge */}
                      <View style={styles.mocRow}>
                        <Text style={[styles.mocLabel, (isLocked || isFuture) && styles.mocLabelLocked, isMissed && styles.mocLabelMissed]}>
                          {stationMeta?.icon} {stationMeta?.name || `Mốc ${exercise.order}`}
                        </Text>
                        {isMissed && (
                          <View style={styles.missedBadge}>
                            <Text style={styles.missedBadgeText}>Bỏ lỡ</Text>
                          </View>
                        )}
                      </View>

                      {/* Cửa sổ thời gian */}
                      <View style={styles.windowRow}>
                        <Ionicons name="alarm-outline" size={11} color={unlocked ? '#D4F93D' : '#4B5563'} />
                        <Text style={[styles.windowText, unlocked && styles.windowTextActive]}>
                          {timeWindow}
                        </Text>
                        {unlocked && !isDone && <View style={styles.activeDot} />}
                      </View>

                      {/* Exercise title từ API */}
                      <Text
                        style={[styles.exerciseTitle, (isDone || isLocked || isFuture || isMissed) && styles.exerciseTitleDimmed]}
                        numberOfLines={2}
                      >
                        {exercise.exercises.title}
                      </Text>

                      {/* Meta chips */}
                      <View style={styles.metaRow}>
                        <View style={styles.metaChip}>
                          <Ionicons name="time-outline" size={12} color="#A1A1AA" />
                          <Text style={styles.metaText}>{formatDuration(exercise.exercises.duration)}</Text>
                        </View>
                        <View style={[styles.metaChip, styles.pointChip]}>
                          <Ionicons name="flash" size={12} color="#D4F93D" />
                          <Text style={[styles.metaText, { color: '#D4F93D' }]}>+{exercise.point}đ</Text>
                        </View>
                      </View>

                      {/* Target muscles */}
                      {exercise.exercises.target_muscle?.length > 0 && (
                        <Text style={styles.muscleText}>
                          🎯 {exercise.exercises.target_muscle.join(' · ')}
                        </Text>
                      )}
                    </View>

                    {/* Action icon */}
                    <View style={styles.actionIcon}>
                      {isDone
                        ? <Ionicons name="checkmark-circle" size={30} color="#D4F93D" />
                        : isMissed
                          ? <Ionicons name="alert-circle" size={30} color="#EF4444" />
                          : (isLocked || isFuture)
                            ? <Ionicons name="lock-closed" size={22} color="rgba(255,255,255,0.15)" />
                            : <Ionicons name="play-circle-outline" size={30} color="rgba(255,255,255,0.3)" />
                      }
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { color: '#A1A1AA', fontSize: 16, fontWeight: '600' },
  errorText: { color: '#EF4444', fontSize: 15, fontWeight: '600', textAlign: 'center', paddingHorizontal: 40 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },

  dateSection: { marginBottom: 22 },
  dateLabel: { fontSize: 13, color: '#64748B', fontWeight: '700', textTransform: 'capitalize', marginBottom: 6 },
  missionTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', lineHeight: 34, letterSpacing: -0.5, marginBottom: 6 },
  missionDesc: { fontSize: 14, color: '#A1A1AA', lineHeight: 20, fontWeight: '500' },

  // Progress
  progressCard: {
    backgroundColor: '#161616', borderRadius: 24, padding: 22,
    marginBottom: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  progressCardDone: { borderColor: '#D4F93D', backgroundColor: 'rgba(212,249,61,0.04)' },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  progressLabel: { fontSize: 11, color: '#64748B', fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  progressPoints: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  progressCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(212,249,61,0.1)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(212,249,61,0.25)',
  },
  progressCircleText: { color: '#D4F93D', fontSize: 14, fontWeight: '900', lineHeight: 18 },
  progressCircleSub: { color: '#D4F93D', fontSize: 10, fontWeight: '700' },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#D4F93D', borderRadius: 3 },
  completeBadge: {
    marginTop: 14, backgroundColor: 'rgba(212,249,61,0.1)',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center',
  },
  completeBadgeText: { color: '#D4F93D', fontWeight: '900', fontSize: 14 },

  emptyContainer: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  emptyIcon: { fontSize: 56 },
  emptyText: { color: '#64748B', fontSize: 17, fontWeight: '600' },

  // Exercise cards
  exerciseList: { gap: 14 },
  exerciseCard: {
    backgroundColor: '#161616', borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  exerciseCardDone: { borderColor: 'rgba(212,249,61,0.25)', backgroundColor: 'rgba(212,249,61,0.03)' },
  exerciseCardLocked: { opacity: 0.55 },
  exerciseCardMissed: { borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.02)' },

  imgWrap: { position: 'relative', marginRight: 14, flexShrink: 0 },
  imgWrapLocked: { opacity: 0.5 },
  exerciseImg: { width: 76, height: 76, borderRadius: 16, backgroundColor: '#2A2A2A' },
  imgPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  orderBadge: {
    position: 'absolute', top: -7, left: -7,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#2A2A2A', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#0A0A0A',
  },
  orderBadgeDone: { backgroundColor: '#D4F93D' },
  orderBadgeLocked: { backgroundColor: '#1E293B' },
  orderText: { color: '#FFF', fontSize: 11, fontWeight: '900' },

  exerciseInfo: { flex: 1, gap: 4 },

  mocRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mocLabel: { fontSize: 12, color: '#D4F93D', fontWeight: '800', letterSpacing: 0.5 },
  mocLabelLocked: { color: '#4B5563' },
  mocLabelMissed: { color: '#EF4444' },

  missedBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  missedBadgeText: { color: '#EF4444', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },

  windowRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  windowText: { fontSize: 11, color: '#4B5563', fontWeight: '700' },
  windowTextActive: { color: '#D4F93D' },
  activeDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#22C55E', marginLeft: 2,
  },

  exerciseTitle: { fontSize: 15, fontWeight: '800', color: '#FFF', lineHeight: 21 },
  exerciseTitleDimmed: { color: '#4B5563' },

  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 2 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  pointChip: { backgroundColor: 'rgba(212,249,61,0.08)' },
  metaText: { fontSize: 11, color: '#A1A1AA', fontWeight: '700' },
  muscleText: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 },

  actionIcon: { paddingLeft: 10, flexShrink: 0 },
});
