import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import axiosClient from '../../api/axiosClient';

const formatDuration = (totalSeconds: number) => {
  const seconds = Number(totalSeconds) || 0;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const getYouTubeID = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function CoursePlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [courseData, setCourseData] = useState<any>(null);
  const [activeExercise, setActiveExercise] = useState<any>(null);
  const [activeLessonKey, setActiveLessonKey] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true);
  
  // THÊM: State quản lý trạng thái tự động phát video
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        if (!id) return;
        setLoading(true);

        const response = await axiosClient.get(`/courses/payment/${id}`);
        let apiBody = response.data ? response.data : response;
        const finalData = apiBody.data ? apiBody.data : apiBody;

        if (finalData && finalData.id) {
          setCourseData(finalData);
          
          const firstDay = finalData.course_days?.[0];
          const firstExerciseItem = firstDay?.course_day_exercises?.[0];
          
          if (firstExerciseItem?.exercises) {
            setActiveExercise(firstExerciseItem.exercises);
            setActiveLessonKey(`${firstDay.id}-${firstExerciseItem.exercises.id}-${firstExerciseItem.order_index}`);
            // Mặc định không tự động phát ngay khi vừa vào khóa học để tránh ồn, 
            // người dùng bấm vào danh sách mới tự động phát.
            setPlaying(false); 
          }
        } else {
            Alert.alert("Lỗi", "Không tìm thấy nội dung khóa học.");
        }
      } catch (error: any) {
        console.error("Lỗi API Player:", error);
        Alert.alert("Thông báo", "Lỗi tải dữ liệu khóa học.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  // THÊM: Theo dõi trạng thái của Youtube Player
  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
      // Bạn có thể thêm code tự động chuyển bài tiếp theo ở đây
    }
    if (state === "paused") {
      setPlaying(false);
    }
    if (state === "playing") {
      setPlaying(true);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#D4F93D" /></View>
    );
  }

  if (!courseData) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Không thể tải khóa học.</Text>
        <TouchableOpacity style={styles.backBtnRed} onPress={() => router.back()}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>QUAY LẠI</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const videoId = getYouTubeID(activeExercise?.video_url);
  const coverImage = activeExercise?.img_list?.[0] || 'https://via.placeholder.com/800x400';

  return (
    <View style={styles.container}>
      
      {/* 1. KHUNG PLAYER YOUTUBE */}
      <View style={styles.videoArea}>
        {videoId ? (
          <YoutubePlayer
            height={260}
            play={playing} // ĐÃ SỬA: Liên kết với state playing
            videoId={videoId}
            onChangeState={onStateChange} // ĐÃ SỬA: Lắng nghe sự kiện video
            initialPlayerParams={{ preventFullScreen: false }}
          />
        ) : (
          <ImageBackground source={{ uri: coverImage }} style={styles.cover}>
            <View style={styles.overlay} />
            <Text style={{color: '#fff'}}>Bài tập này chưa có Video</Text>
          </ImageBackground>
        )}
        
        <SafeAreaView edges={['top']} style={styles.backContainer}>
          <TouchableOpacity style={styles.circleBack} onPress={() => router.back()}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* 2. THÔNG TIN BÀI TẬP */}
      <View style={styles.playingInfo}>
        <Text style={styles.playingTitle}>{activeExercise?.title || "Chưa chọn bài tập"}</Text>
        <Text style={styles.playingDesc} numberOfLines={2}>
            {activeExercise?.description || "Không có mô tả."}
        </Text>
        <View style={styles.tagRow}>
          {activeExercise?.target_muscle?.map((m: string, i: number) => (
            <View key={i} style={styles.tag}><Text style={styles.tagText}>{m}</Text></View>
          ))}
        </View>
      </View>

      {/* 3. DANH SÁCH BÀI TẬP */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainer}>
        <Text style={styles.courseName}>{courseData.title}</Text>
        <Text style={styles.levelLabel}>Cấp độ: {courseData.level}</Text>

        {courseData.course_days?.map((day: any) => (
          <View key={day.id} style={styles.dayGroup}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayLabel}>Ngày {day.day_number}</Text>
              <Text style={styles.daySub}>Tuần {day.week_number} • Giai đoạn {day.phase_number}</Text>
            </View>

            {day.course_day_exercises
              ?.sort((a: any, b: any) => a.order_index - b.order_index)
              .map((item: any) => {
              const ex = item.exercises;
              if (!ex) return null;
              
              const currentLessonKey = `${day.id}-${ex.id}-${item.order_index}`;
              const isActive = activeLessonKey === currentLessonKey;
              
              return (
                <TouchableOpacity 
                  key={currentLessonKey} 
                  style={[styles.exCard, isActive && styles.exCardActive]}
                  onPress={() => {
                    setActiveExercise(ex);
                    setActiveLessonKey(currentLessonKey);
                    setPlaying(true); // ĐÃ SỬA: Bấm vào là lập tức tự động phát video
                  }}
                  activeOpacity={0.8}
                >
                  <ImageBackground source={{ uri: ex.img_list?.[0] || coverImage }} style={styles.thumbnail} imageStyle={{borderRadius: 8}}>
                    {isActive && (
                      <View style={styles.activeOverlay}>
                        {/* Nếu đang phát thì hiện icon loa, nếu đang pause hiện icon khác */}
                        <Ionicons name={playing ? "volume-medium" : "pause"} size={20} color="#D4F93D" />
                      </View>
                    )}
                  </ImageBackground>

                  <View style={styles.exInfo}>
                    <Text style={[styles.exTitle, isActive && styles.exTitleActive]}>
                      {item.order_index}. {ex.title}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                       <Ionicons name="time-outline" size={14} color={isActive ? "#D4F93D" : "#6B7280"} />
                       <Text style={[styles.exTime, isActive && styles.exTimeActive]}> {formatDuration(ex.duration)}</Text>
                    </View>
                  </View>
                  <Ionicons name={isActive && playing ? "pause-circle" : "play-circle"} size={30} color={isActive ? "#D4F93D" : "#E5E7EB"} />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={{height: 60}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtnRed: { marginTop: 20, padding: 12, paddingHorizontal: 30, backgroundColor: '#111', borderRadius: 100 },
  
  videoArea: { width: '100%', height: 260, backgroundColor: '#000' },
  cover: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  backContainer: { position: 'absolute', top: 0, left: 15, zIndex: 10 },
  circleBack: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  
  playingInfo: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  playingTitle: { fontSize: 20, fontWeight: '900', color: '#111', marginBottom: 6 },
  playingDesc: { fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 20 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: '700', color: '#4B5563', textTransform: 'uppercase' },

  listContainer: { flex: 1, padding: 20 },
  courseName: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 6 },
  levelLabel: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginBottom: 25, textTransform: 'capitalize' },
  
  dayGroup: { marginBottom: 25 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 8 },
  dayLabel: { fontSize: 16, fontWeight: '900', color: '#111' },
  daySub: { fontSize: 12, color: '#9CA3AF', fontWeight: '700' },
  
  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#F3F4F6', padding: 12, borderRadius: 16, marginBottom: 12 },
  exCardActive: { backgroundColor: '#111', borderColor: '#111' },
  thumbnail: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  activeOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  
  exInfo: { flex: 1, paddingHorizontal: 12, justifyContent: 'center' },
  exTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 4 },
  exTitleActive: { color: '#fff' },
  
  exTime: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  exTimeActive: { color: '#D4F93D' }
});