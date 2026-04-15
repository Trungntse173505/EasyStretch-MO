import exerciseApi from '../../api/exerciseApi';
import { useExercisesClient } from '@/hooks/exercise/useExercisesClient';
import { transformMediaUrl } from '@/utils/mediaUtils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import axiosClient from '../../api/axiosClient';

const { width: SW, height: SH } = Dimensions.get('window');

const formatDuration = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// ─────────────────────────────────────────────
// Sub-component: Circular countdown timer
// ─────────────────────────────────────────────
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircleTimer({ total, current }: { total: number; current: number }) {
  const progress = total > 0 ? current / total : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={{ width: 110, height: 110, alignItems: 'center', justifyContent: 'center' }}>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, borderRadius: 55, borderWidth: 8, borderColor: '#E2E8F0' }} />
      </View>
      {/* simple fill approximation with border */}
      <View
        style={{
          position: 'absolute',
          width: RADIUS * 2 + 8,
          height: RADIUS * 2 + 8,
          borderRadius: RADIUS + 4,
          borderWidth: 8,
          borderColor: '#3B82F6',
          borderRightColor: progress < 0.25 ? '#3B82F6' : '#E2E8F0',
          borderBottomColor: progress < 0.5 ? '#3B82F6' : '#E2E8F0',
          borderLeftColor: progress < 0.75 ? '#3B82F6' : '#E2E8F0',
          borderTopColor: '#3B82F6',
          transform: [{ rotate: `${-90 + (1 - progress) * 360}deg` }],
        }}
      />
      <Text style={{ fontSize: 36, fontWeight: '900', color: '#1E293B' }}>{current}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export default function RelaxationPlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, title, startIndex: startIndexParam, mode } = useLocalSearchParams<{
    id: string; title: string; startIndex: string; mode: string;
  }>();

  const isWorkoutMode = mode === 'workout';
  const initialIndex = parseInt(startIndexParam || '0', 10);

  const { exercises: allExercises, loading: loadingEx } = useExercisesClient();
  const [courseData, setCourseData] = useState<any>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Exercise detail state (fetched per-exercise)
  const [activeExDetail, setActiveExDetail] = useState<any>(null);
  const [currentImageUri, setCurrentImageUri] = useState<string>('');
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Timer
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animRef = useRef<{ cancelled: boolean; timeout?: NodeJS.Timeout }>({ cancelled: false });

  // Tab state removed - show all content directly

  // ── 1. Fetch course data ────────────────────
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return;
        setLoadingCourse(true);
        const res = await axiosClient.get(`/courses/all/${id}`);
        setCourseData(res.data?.data || res.data);
      } catch (e) {
        console.log('Lỗi tải course:', e);
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchCourse();
  }, [id]);

  // ── 2. Map exercises ────────────────────────
  const mappedExercises = useMemo(() => {
    if (!courseData?.course_days || !allExercises.length) return [];
    const list: any[] = [];
    courseData.course_days.forEach((day: any) => {
      day.course_day_exercises?.forEach((cde: any) => {
        const match = allExercises.find(ex => ex.id === cde.exercise_id);
        if (match) list.push({ ...match, order_index: cde.order_index });
      });
    });
    return list.sort((a, b) => a.order_index - b.order_index);
  }, [courseData, allExercises]);

  const activeEx = mappedExercises[currentIndex];

  // ── 3. Fetch detail + start animation ───────
  useEffect(() => {
    if (!activeEx) return;

    setLoadingDetail(true);
    setIsPlaying(false);
    setActiveExDetail(null);
    setCurrentImageUri(activeEx.img_list?.[0] || '');
    animRef.current.cancelled = true; // cancel old animation

    exerciseApi.getById(activeEx.id).then(detail => {
      setActiveExDetail(detail);
      const dur = detail.duration || activeEx.duration || 30;
      setTotalTime(dur);
      setTimeLeft(dur);
      setCurrentImageUri(detail.img_list?.[0] || activeEx.img_list?.[0] || '');
      setLoadingDetail(false);
      if (isWorkoutMode) setIsPlaying(true); // auto-start in workout mode
    }).catch(() => {
      setLoadingDetail(false);
    });
  }, [currentIndex, activeEx?.id]);

  // ── 4. Animation loop (time_line) ───────────
  useEffect(() => {
    if (!isPlaying || !activeExDetail?.time_line?.length) return;

    const ctrl: { cancelled: boolean; timeout?: ReturnType<typeof setTimeout> } = { cancelled: false };
    animRef.current = ctrl;

    const runLoop = async () => {
      let i = 0;
      while (!ctrl.cancelled) {
        const frame = activeExDetail.time_line[i];
        const uri = activeExDetail.img_list?.[frame.imageIndex];
        if (uri) setCurrentImageUri(uri);
        await new Promise<void>(resolve => {
          ctrl.timeout = setTimeout(resolve, frame.duration);
        });
        i = (i + 1) % activeExDetail.time_line.length;
      }
    };

    runLoop();
    return () => {
      ctrl.cancelled = true;
      if (ctrl.timeout) clearTimeout(ctrl.timeout);
    };
  }, [isPlaying, activeExDetail]);

  // ── 5. Countdown timer ───────────────────────
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft === 0 && isPlaying) handleNext();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, isPlaying]);

  const handleNext = useCallback(() => {
    if (currentIndex < mappedExercises.length - 1) {
      setCurrentIndex(p => p + 1);
    } else {
      router.back();
    }
  }, [currentIndex, mappedExercises.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(p => p - 1);
  }, [currentIndex]);

  const adjustTime = (d: number) => setTimeLeft(p => Math.max(0, p + d));

  // ── Loading state ────────────────────────────
  if (loadingCourse || loadingEx || !activeEx) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const imageUri = transformMediaUrl(currentImageUri || activeEx.img_list?.[0]) || 'https://via.placeholder.com/600';

  // ════════════════════════════════════════════
  //  WORKOUT MODE  (Ảnh 2)
  // ════════════════════════════════════════════
  if (isWorkoutMode) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Full-screen animation image */}
        <View style={styles.workoutImageArea}>
          {loadingDetail ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ flex: 1 }} />
          ) : (
            <Image source={{ uri: imageUri }} style={styles.workoutImage} resizeMode="contain" />
          )}
        </View>

        {/* Info card */}
        <View style={styles.workoutCard}>
          <Text style={styles.workoutReadyLabel}>ĐÃ SẴN SÀNG TẬP!</Text>
          <Text style={styles.workoutExTitle}>{activeEx.title}</Text>

          {/* Circular timer + next arrow */}
          <View style={styles.workoutTimerRow}>
            <CircleTimer total={totalTime} current={timeLeft} />
            <TouchableOpacity style={styles.workoutNextBtn} onPress={handleNext}>
              <Ionicons name="chevron-forward" size={32} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* Bottom controls */}
          <View style={[styles.workoutControls, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
            <TouchableOpacity style={styles.workoutControlBtn} onPress={handlePrev} disabled={currentIndex === 0}>
              <Ionicons name="play-skip-back" size={22} color={currentIndex === 0 ? '#CBD5E1' : '#64748B'} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.workoutControlBtn, styles.workoutPlayPause]} onPress={() => setIsPlaying(p => !p)}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.workoutControlBtn} onPress={() => router.back()}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ════════════════════════════════════════════
  //  SINGLE MODE  (Ảnh 1)
  // ════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{activeEx.title}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Animation image */}
        <View style={styles.singleImageArea}>
          {loadingDetail ? (
            <ActivityIndicator size="large" color="#3B82F6" />
          ) : (
            <Image source={{ uri: imageUri }} style={styles.singleImage} resizeMode="contain" />
          )}
        </View>

        {/* Timer row */}
        <View style={styles.timerRow}>
          <Text style={styles.timerLabel}>THỜI LƯỢNG</Text>
          <View style={styles.timerControls}>
            <TouchableOpacity style={styles.timeBtn} onPress={() => adjustTime(-5)}>
              <Ionicons name="remove" size={22} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.timeValue}>{formatDuration(timeLeft)}</Text>
            <TouchableOpacity style={styles.timeBtn} onPress={() => adjustTime(5)}>
              <Ionicons name="add" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Target muscles */}
        {activeEx.target_muscle?.length > 0 && (
          <View style={styles.muscleRow}>
            {activeEx.target_muscle.map((m: string) => (
              <View key={m} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>{m}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Description */}
        {(activeExDetail?.description || activeEx.description) ? (
          <View style={styles.instructionBox}>
            <Text style={styles.instructionLabel}>HƯỚNG DẪN</Text>
            <Text style={styles.instructionText}>
              {activeExDetail?.description || activeEx.description}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom bar: Prev | counter | Next + ĐÓNG */}
      <View style={[styles.singleBottom, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0} style={[styles.navBtn, currentIndex === 0 && { opacity: 0.3 }]}>
            <Ionicons name="play-skip-back" size={28} color="#94A3B8" />
          </TouchableOpacity>
          <Text style={styles.navCounter}>{currentIndex + 1}/{mappedExercises.length}</Text>
          <TouchableOpacity onPress={handleNext} style={styles.navBtn}>
            <Ionicons name="play-skip-forward" size={28} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomActionsRow}>
          <TouchableOpacity
            style={[styles.playPauseBtn, { backgroundColor: isPlaying ? '#FEF2F2' : '#EFF6FF' }]}
            onPress={() => setIsPlaying(p => !p)}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color={isPlaying ? '#EF4444' : '#3B82F6'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Text style={styles.closeBtnText}>ĐÓNG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },

  // ── Header (single mode) ─────────────────────
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '900', color: '#1E293B', textAlign: 'center', textTransform: 'uppercase', marginHorizontal: 8 },

  // ── Single mode image ────────────────────────
  singleImageArea: { width: '100%', height: 280, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  singleImage: { width: '100%', height: '100%' },

  // ── Tabs ─────────────────────────────────────
  tabRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 18, paddingHorizontal: 20, backgroundColor: '#F1F5F9', borderRadius: 100, marginHorizontal: 20, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 100, alignItems: 'center' },
  tabActive: { backgroundColor: '#3B82F6' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#FFF' },

  // ── Timer row ────────────────────────────────
  timerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginVertical: 10 },
  timerLabel: { fontSize: 17, fontWeight: '900', color: '#3B82F6' },
  timerControls: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  timeBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  timeValue: { fontSize: 30, fontWeight: '900', color: '#1E293B' },

  // ── Instruction ──────────────────────────────
  instructionBox: { paddingHorizontal: 24, marginTop: 16 },
  instructionLabel: { fontSize: 15, fontWeight: '900', color: '#3B82F6', marginBottom: 10 },
  instructionText: { fontSize: 16, color: '#475569', lineHeight: 28 },

  // ── Muscles ──────────────────────────────────
  muscleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 24, marginTop: 16 },
  muscleTag: { backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100 },
  muscleTagText: { color: '#3B82F6', fontSize: 13, fontWeight: '700' },

  // ── Single bottom bar ────────────────────────
  singleBottom: {
    position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF',
    paddingHorizontal: 24, paddingTop: 14,
    paddingBottom: 16, // overridden dynamically via insets
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 10,
  },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, marginBottom: 12 },
  navBtn: { padding: 6 },
  navCounter: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  bottomActionsRow: { flexDirection: 'row', gap: 12 },
  playPauseBtn: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  closeBtn: { flex: 1, backgroundColor: '#3B82F6', borderRadius: 100, justifyContent: 'center', alignItems: 'center', height: 60 },
  closeBtnText: { color: '#FFF', fontSize: 17, fontWeight: '900', letterSpacing: 0.5 },

  // ── Workout mode ─────────────────────────────
  workoutImageArea: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  workoutImage: { width: SW, height: SH * 0.48 },
  workoutCard: { backgroundColor: '#FFF', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 28, paddingTop: 28, shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 12 },
  workoutReadyLabel: { fontSize: 24, fontWeight: '900', color: '#3B82F6', textAlign: 'center', marginBottom: 6 },
  workoutExTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B', textAlign: 'center', marginBottom: 20 },
  workoutTimerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, marginBottom: 24 },
  workoutNextBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  workoutControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  workoutControlBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  workoutPlayPause: { backgroundColor: '#3B82F6', width: 60, height: 60, borderRadius: 30 },
});
