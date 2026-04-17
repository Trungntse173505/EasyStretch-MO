import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMissions } from "@/hooks/mission/useMissions";
import { transformMediaUrl } from "@/utils/mediaUtils";
import { useVideoPlayer, VideoView } from 'expo-video';
import YoutubePlayer from "react-native-youtube-iframe";
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const getYouTubeID = (url: any) => {
    if (!url) return null;
    const urlStr = Array.isArray(url) ? url[0] : url;
    if (typeof urlStr !== 'string' || urlStr === '' || urlStr === 'null') return null;
    try {
      const decodedUrl = decodeURIComponent(urlStr).trim();
      // Regex mạnh mẽ cho mọi định dạng YouTube
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = decodedUrl.match(regex);
      if (match) return match[1];
      if (decodedUrl.length === 11) return decodedUrl;
      return null;
    } catch (e) {
      return null;
    }
  };

  const { missions, fetchMissions, finishExercise } = useMissions();

  useEffect(() => {
    if (params.date) {
      fetchMissions(params.date);
    }
  }, [params.date]);

  const allExercises = useMemo(() => {
    return missions
      .flatMap(m => m.mission_exercises.map(me => ({ ...me.exercises, order: me.order })))
      .sort((a, b) => a.order - b.order);
  }, [missions]);

  const nextEx = useMemo(() => {
    const idx = allExercises.findIndex(ex => ex.id === params.exercise_id);
    if (idx !== -1 && idx < allExercises.length - 1) {
      return allExercises[idx + 1];
    }
    return null;
  }, [allExercises, params.exercise_id]);

  const videoId = useMemo(() => getYouTubeID(params.video_url), [params.video_url]);
  const hasVideo = !!videoId;
  const isDirectVideo = !hasVideo && params.video_url;

  const player = useVideoPlayer(isDirectVideo ? (transformMediaUrl(params.video_url, 'video') ?? '') : '', (player) => {
    player.loop = true;
    player.bufferOptions = {
      preferredForwardBufferDuration: 30,
      maxBufferBytes: 50 * 1024 * 1024,
    };
  });

  const duration = parseInt(params.duration || '60', 10);

  // ---- Timer states (dùng khi không có video) ----
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ---- Video states (dùng khi có video) ----
  const playerRef = useRef<any>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoStatus, setVideoStatus] = useState<string>('idle');
  const isFirstPlay = useRef(true); 

  // ---- Image Animation States (dùng khi không có video) ----
  const [currentImageUri, setCurrentImageUri] = useState<string>(params.img_url || '');
  const animRef = useRef<{ cancelled: boolean; timeout?: NodeJS.Timeout }>({ cancelled: false });
  
  const activeEx = useMemo<any>(() => {
    return allExercises.find(ex => ex.id === params.exercise_id);
  }, [allExercises, params.exercise_id]);

  useEffect(() => {
    if (params.img_url && !currentImageUri) {
      setCurrentImageUri(params.img_url);
    }
  }, [params.img_url]);

  // ---- Voice Coach Setup ----
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  useEffect(() => {
    let active = true;
    const playIntro = async () => {
      const val = await AsyncStorage.getItem('VOICE_COACH');
      const voiceOn = val !== 'false';
      if (!active) return;
      setIsVoiceEnabled(voiceOn);
      
      if (voiceOn && params.description) {
        Speech.stop();
        Speech.speak(params.description, { language: 'vi-VN', rate: 0.95 });
      }
    };
    playIntro();
    return () => {
      active = false;
      Speech.stop();
    };
  }, [params.description]);

  const toggleVoice = () => {
    setIsVoiceEnabled(prev => {
      const next = !prev;
      AsyncStorage.setItem('VOICE_COACH', next ? 'true' : 'false');
      if (!next) Speech.stop();
      return next;
    });
  };

  // Sync direct video playback with isRunning
  useEffect(() => {
    if (isDirectVideo) {
      const sub = player.addListener('statusChange', (payload: any) => {
        setVideoStatus(payload.status);
      });
      if (isRunning) player.play();
      else player.pause();
      return () => sub.remove();
    }
  }, [isRunning, player, isDirectVideo]);

  // ---- Common ----
  const [isFinished, setIsFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Theo dõi xem đã bắt đầu tập chưa

  // Điều khiển Video trực tiếp qua Ref với thủ thuật Seek để "mồi" video chạy trên Android
  useEffect(() => {
    if (hasVideo && hasStarted && videoReady) {
      if (isRunning) {
        // Chỉ seek mồi 1 lần duy nhất khi mới bắt đầu để phá băng WebView Android 
        // Sau đó gọi playVideo để đảm bảo khởi động
        if (isFirstPlay.current) {
          playerRef.current?.seekTo?.(0, true);
          isFirstPlay.current = false;
        }
        
        const timer = setTimeout(() => {
          playerRef.current?.playVideo?.();
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // Khi dừng, ta để player tự xử lý qua prop play={false} 
        // để tránh xung đột lệnh pauseVideo với trạng thái nội bộ của nó
      }
    }
  }, [isRunning, hasVideo, hasStarted, videoReady]);

  // Image Animation Loop (dùng time_line)
  useEffect(() => {
    let rawTimeLine = activeEx?.time_line;
    if (!isRunning || !rawTimeLine || hasVideo || isDirectVideo) return;

    if (typeof rawTimeLine === 'string') {
      try {
        rawTimeLine = JSON.parse(rawTimeLine);
      } catch (error) {
        rawTimeLine = [];
      }
    }

    if (!Array.isArray(rawTimeLine) || rawTimeLine.length === 0) return;

    const ctrl: { cancelled: boolean; timeout?: ReturnType<typeof setTimeout> } = { cancelled: false };
    animRef.current = ctrl;

    const runLoop = async () => {
      let i = 0;
      while (!ctrl.cancelled) {
        let frame = rawTimeLine[i];

        if (typeof frame === 'string') {
          try { frame = JSON.parse(frame); } catch (e) { }
        }

        if (frame && typeof frame === 'object') {
          let rawIdx = frame.imageIndex !== undefined ? frame.imageIndex : frame.image_index;
          let idx = parseInt(String(rawIdx || '0'), 10);
          if (isNaN(idx)) idx = 0;

          const uri = activeEx?.img_list?.[idx];
          if (uri) setCurrentImageUri(uri);

          await new Promise<void>(resolve => {
            const duration = Number(frame.duration) || 1000;
            ctrl.timeout = setTimeout(resolve, duration);
          });
        } else {
          await new Promise<void>(resolve => {
            ctrl.timeout = setTimeout(resolve, 1000);
          });
        }

        i = (i + 1) % rawTimeLine.length;
      }
    };

    runLoop();
    return () => {
      ctrl.cancelled = true;
      if (ctrl.timeout) clearTimeout(ctrl.timeout);
    };
  }, [isRunning, activeEx, hasVideo, isDirectVideo]);


  // Xác định trạng thái "xong" khi timer = 0
  useEffect(() => {
    if (timeLeft === 0) setIsFinished(true);
  }, [timeLeft]);

  const onVideoStateChange = useCallback((state: string) => {
    // Chỉ xử lý khi video kết thúc hẳn để đóng bài tập
    if (state === "ended") {
      setIsRunning(false);
    }
    // KHÔNG cho phép YouTube tự ý đổi trạng thái isRunning của App 
    // để tránh vòng lặp khiến nút Pause ở dưới không có tác dụng.
  }, []);

  // Pulse animation
  useEffect(() => {
    if (isRunning) {
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
  }, [isRunning]);

  // Timer countdown
  useEffect(() => {
    if (isRunning) {
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
  }, [isRunning]);

  // Animate timer progress bar
  useEffect(() => {
    const progress = 1 - timeLeft / duration;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, duration]);

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

  const togglePlay = () => {
    if (!hasStarted) setHasStarted(true);
    setIsRunning(prev => !prev);
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const preloadedImages = useMemo(() => {
    const list = activeEx?.img_list || [];
    const allUrls = [...list, params.img_url].filter(Boolean);
    const transformedUrls = allUrls.map((u: any) => transformMediaUrl(u) || 'https://via.placeholder.com/600');
    return Array.from(new Set(transformedUrls));
  }, [activeEx?.img_list, params.img_url]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Vùng ẩn dùng tải trước toàn bộ ảnh vào cache */}
      <View style={{ position: 'absolute', opacity: 0, width: 1, height: 1, overflow: 'hidden' }}>
        {preloadedImages.map((uri, index) => <Image key={`preload-ex-${index}-${uri}`} source={{ uri }} />)}
      </View>

      {/* HEADER (floating) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity style={styles.backBtn} onPress={toggleVoice} activeOpacity={0.8}>
            <Ionicons name={isVoiceEnabled ? "volume-medium" : "volume-mute"} size={20} color={isVoiceEnabled ? "#D4F93D" : "#FFF"} />
          </TouchableOpacity>
          <View style={styles.pointBadge}>
            <Ionicons name="flash" size={14} color="#111" />
            <Text style={styles.pointBadgeText}>+{params.point} ĐIỂM</Text>
          </View>
        </View>
      </View>

      {/* ====== VIDEO hoặc IMAGE ====== */}
      <View style={styles.mediaContainer}>
        {hasVideo && hasStarted ? (
          <YoutubePlayer
            ref={playerRef}
            key={videoId}
            height={260}
            width={Dimensions.get('window').width}
            play={isRunning}
            videoId={videoId}
            mute={true}
            onReady={() => setVideoReady(true)}
            onChangeState={onVideoStateChange}
            forceAndroidAutoplay={true}
            initialPlayerParams={{
              autoplay: false, // Dùng Ref điều khiển nên tắt autoplay của cái này
              rel: false,
              modestbranding: true,
              cc_load_policy: 0,
            }}
            webViewProps={{
              allowsFullscreenVideo: true,
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
              javaScriptEnabled: true,
              domStorageEnabled: true,
              mixedContentMode: "always",
              androidLayerType: "hardware",
              renderToHardwareTextureAndroid: true,
              allowsProtectedMediaPlaybackAndroid: true, // Thêm quyền điều khiển Media trên Android
            }}
          />
        ) : isDirectVideo && hasStarted ? (
          <View style={{ width: '100%', height: 260 }}>
             <VideoView
              style={{ width: '100%', height: 260 }}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
            {(videoStatus === 'loading' || videoStatus === 'idle') && (
              <Image source={{ uri: transformMediaUrl(params.img_url) || 'https://via.placeholder.com/200' }} style={[styles.media, StyleSheet.absoluteFill]} resizeMode="cover" />
            )}
          </View>
        ) : (currentImageUri || params.img_url || !hasStarted) ? (
          <Image source={{ uri: transformMediaUrl(currentImageUri || params.img_url) }} style={styles.media} resizeMode="contain" />
        ) : (
          <View style={[styles.media, styles.mediaplaceHolder]}>
            <Ionicons name="fitness" size={80} color="#D4F93D" />
          </View>
        )}
        {!hasStarted && <View style={styles.mediaOverlay} />}
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

        {/* TIMER UI - PROGRESS BAR ONLY */}
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabelText}>0:00</Text>
          <Text style={styles.progressLabelText}>
            {isFinished ? 'SẴN SÀNG HOÀN THÀNH' : formatTime(timeLeft)}
          </Text>
        </View>

        {/* ====== CONTROLS ====== */}
        {!isFinished ? (
          <View style={styles.controls}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
              <Ionicons name="refresh" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mainBtn}
              onPress={togglePlay}
              activeOpacity={0.85}
            >
              <Ionicons name={isRunning ? 'pause' : 'play'} size={32} color="#111" />
            </TouchableOpacity>
            <View style={{ width: 56 }} />
          </View>
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
