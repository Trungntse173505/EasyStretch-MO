import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMissions } from "@/hooks/mission/useMissions";

export default function ExercisePlayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mission_id: string;
    exercise_id: string;
    title: string;
    station_name: string;
    station_icon: string;
    instructions: string;
    duration: string;
    img_url: string;
    video_url: string;
    description: string;
    point: string;
    date: string;
  }>();

  const { finishExercise } = useMissions();

  const hasVideo = !!params.video_url && params.video_url !== '' && params.video_url !== 'null';
  const duration = parseInt(params.duration || '60', 10);

  // ---- Timer states (dùng khi không có video) ----
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ---- Video states (dùng khi có video) ----
  const videoRef = useRef<Video>(null);
  const [videoFinished, setVideoFinished] = useState(false);

  // ---- Common ----
  const [isFinished, setIsFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Xác định trạng thái "xong" (video kết thúc HOẶC timer = 0)
  useEffect(() => {
    if (!hasVideo && timeLeft === 0) setIsFinished(true);
  }, [timeLeft, hasVideo]);

  useEffect(() => {
    if (hasVideo && videoFinished) setIsFinished(true);
  }, [videoFinished, hasVideo]);

  // Pulse animation (chỉ dùng cho timer)
  useEffect(() => {
    if (!hasVideo && isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isRunning, hasVideo]);

  // Timer countdown
  useEffect(() => {
    if (!hasVideo && isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, hasVideo]);

  // Animate timer progress bar
  useEffect(() => {
    if (!hasVideo) {
      const progress = 1 - timeLeft / duration;
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [timeLeft, duration, hasVideo]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsFinished(false);
    progressAnim.setValue(0);
  }, [duration]);

  const handleComplete = async () => {
    if (submitting) return;
    setSubmitting(true);
    const ok = await finishExercise(params.mission_id, params.exercise_id, params.date);
    setSubmitting(false);
    if (ok) {
      router.back();
    } else {
      Alert.alert('Lỗi', 'Không thể ghi nhận kết quả, vui lòng thử lại!', [
        { text: 'Thử lại', onPress: handleComplete },
        { text: 'Bỏ qua', style: 'cancel', onPress: () => router.back() },
      ]);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER (floating) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.pointBadge}>
          <Ionicons name="flash" size={14} color="#111" />
          <Text style={styles.pointBadgeText}>+{params.point} ĐIỂM</Text>
        </View>
      </View>

      {/* ====== VIDEO hoặc IMAGE ====== */}
      <View style={styles.mediaContainer}>
        {hasVideo ? (
          <Video
            ref={videoRef}
            source={{ uri: params.video_url }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) {
                setVideoFinished(true);
              }
            }}
          />
        ) : params.img_url ? (
          <Image source={{ uri: params.img_url }} style={styles.media} resizeMode="cover" />
        ) : (
          <View style={[styles.media, styles.mediaplaceHolder]}>
            <Ionicons name="fitness" size={80} color="#D4F93D" />
          </View>
        )}
        <View style={styles.mediaOverlay} />

        {/* Hiển thị badge "Đang phát video" khi có video chưa xong */}
        {hasVideo && !videoFinished && (
          <View style={styles.watchHint}>
            <Ionicons name="eye" size={14} color="#FFF" />
            <Text style={styles.watchHintText}>Xem hết video để hoàn thành</Text>
          </View>
        )}
      </View>

      {/* ====== CONTENT ====== */}
      <View style={styles.content}>
        {/* Station Badge */}
        <View style={styles.stationBadge}>
          <Text style={styles.stationBadgeIcon}>{params.station_icon || '🏃'}</Text>
          <Text style={styles.stationBadgeName}>{params.station_name || ''}</Text>
        </View>

        {/* Title */}
        <Text style={styles.exerciseTitle}>{params.title}</Text>
        {params.description ? (
          <Text style={styles.exerciseDesc}>{params.description}</Text>
        ) : null}

        {/* ====== TIMER (chỉ render khi KHÔNG có video) ====== */}
        {!hasVideo && (
          <>
            <Animated.View style={[styles.timerCircle, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerLabel}>
                {isFinished ? 'XONG!' : isRunning ? 'đang tập...' : 'sẵn sàng'}
              </Text>
            </Animated.View>

            <View style={styles.progressBg}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabelText}>0:00</Text>
              <Text style={styles.progressLabelText}>{formatTime(duration)}</Text>
            </View>
          </>
        )}

        {/* ====== CONTROLS ====== */}
        {!isFinished ? (
          // Timer controls (chỉ hiện khi không có video)
          !hasVideo ? (
            <View style={styles.controls}>
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
                <Ionicons name="refresh" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mainBtn}
                onPress={() => setIsRunning(r => !r)}
                activeOpacity={0.85}
              >
                <Ionicons name={isRunning ? 'pause' : 'play'} size={32} color="#111" />
              </TouchableOpacity>
              <View style={{ width: 56 }} />
            </View>
          ) : (
            // Đang xem video — hiển thị hint
            <View style={styles.videoHintBox}>
              <Ionicons name="videocam" size={22} color="#D4F93D" />
              <Text style={styles.videoHintText}>
                Xem hết video bên trên rồi bấm Hoàn thành!
              </Text>
            </View>
          )
        ) : (
          // NÚT HOÀN THÀNH — chỉ hiện khi video xong hoặc timer = 0
          <TouchableOpacity
            style={[styles.completeBtn, submitting && { opacity: 0.7 }]}
            onPress={handleComplete}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <Text style={styles.completeBtnText}>Đang lưu...</Text>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={26} color="#111" />
                <Text style={styles.completeBtnText}>HOÀN THÀNH BÀI TẬP</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center',
  },
  pointBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#D4F93D', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  pointBadgeText: { color: '#111', fontWeight: '900', fontSize: 14 },

  mediaContainer: { height: 260, position: 'relative' },
  media: { width: '100%', height: '100%' },
  mediaplaceHolder: { backgroundColor: '#161616', justifyContent: 'center', alignItems: 'center' },
  mediaOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  watchHint: {
    position: 'absolute', bottom: 14, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 8,
  },
  watchHintText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20, alignItems: 'center' },

  stationBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(212,249,61,0.1)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8, marginBottom: 10,
  },
  stationBadgeIcon: { fontSize: 18 },
  stationBadgeName: { color: '#D4F93D', fontWeight: '800', fontSize: 14 },

  exerciseTitle: {
    fontSize: 22, fontWeight: '900', color: '#FFF',
    textAlign: 'center', marginBottom: 6, letterSpacing: -0.5,
  },
  exerciseDesc: {
    fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 19,
    marginBottom: 16, fontWeight: '500',
  },

  // Timer UI
  timerCircle: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 4, borderColor: '#D4F93D', backgroundColor: '#161616',
    justifyContent: 'center', alignItems: 'center', marginBottom: 18,
    shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 18, elevation: 10,
  },
  timerText: { fontSize: 32, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
  timerLabel: { fontSize: 11, color: '#64748B', fontWeight: '700', marginTop: 4, textTransform: 'uppercase' },

  progressBg: {
    width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3, overflow: 'hidden', marginBottom: 6,
  },
  progressFill: { height: '100%', backgroundColor: '#D4F93D', borderRadius: 3 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 24 },
  progressLabelText: { fontSize: 12, color: '#64748B', fontWeight: '600' },

  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  resetBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  mainBtn: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#D4F93D',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10,
  },

  // Video hint
  videoHintBox: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(212,249,61,0.08)', borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 20,
    borderWidth: 1, borderColor: 'rgba(212,249,61,0.2)',
    width: '100%',
  },
  videoHintText: { flex: 1, color: '#A1A1AA', fontSize: 14, fontWeight: '600', lineHeight: 20 },

  // Complete button
  completeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#D4F93D',
    paddingVertical: 20, paddingHorizontal: 36,
    borderRadius: 24, width: '100%', justifyContent: 'center',
    shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
  },
  completeBtnText: { color: '#111', fontSize: 17, fontWeight: '900', letterSpacing: 0.5 },
});
