import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosClient from '../../api/axiosClient'; // Đảm bảo đường dẫn import đúng
const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function CoursePlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  
  const [courseData, setCourseData] = useState<any>(null);
  const [activeExercise, setActiveExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. GỌI API LẤY CHI TIẾT KHÓA HỌC ĐÃ MUA
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/courses/payment/${id}`);
        const data = response.data;
        setCourseData(data);

        // Tự động chọn bài tập đầu tiên của ngày đầu tiên làm bài đang phát
        if (data.course_days && data.course_days.length > 0) {
          const firstDay = data.course_days[0];
          if (firstDay.course_day_exercises && firstDay.course_day_exercises.length > 0) {
            // Lấy object 'exercises' bên trong mảng
            setActiveExercise(firstDay.course_day_exercises[0].exercises);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetail();
    }
  }, [id]);

  // Hàm mở link YouTube khi bấm Play
  const handlePlayVideo = () => {
    if (activeExercise?.video_url) {
      Linking.openURL(activeExercise.video_url).catch(() => {
        alert("Không thể mở video này!");
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4F93D" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Đang tải dữ liệu khóa học...</Text>
      </View>
    );
  }

  if (!courseData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>Không tìm thấy dữ liệu khóa học.</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
          <Text style={{ color: '#111', fontWeight: 'bold' }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Lấy ảnh bìa cho video player (ưu tiên ảnh của bài tập, nếu không có lấy ảnh khóa học)
  const coverImage = activeExercise?.img_list?.[0] || courseData.img_url || 'https://via.placeholder.com/800x400';

  return (
    <View style={styles.container}>
      {/* 1. KHU VỰC VIDEO PLAYER */}
      <View style={styles.playerContainer}>
        <ImageBackground source={{ uri: coverImage }} style={styles.videoPlaceholder}>
          <View style={styles.videoOverlay} />
          
          {/* Nút Back */}
          <SafeAreaView edges={['top']} style={styles.headerTop}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-down" size={28} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Nút Play (Sẽ mở YouTube) */}
          <TouchableOpacity style={styles.playCircle} onPress={handlePlayVideo} activeOpacity={0.8}>
            <Ionicons name="play" size={32} color="#111" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </ImageBackground>
      </View>

      {/* 2. THÔNG TIN BÀI TẬP ĐANG PHÁT */}
      {activeExercise && (
        <View style={styles.playingInfo}>
          <Text style={styles.playingTitle}>{activeExercise.title}</Text>
          <Text style={styles.playingDesc} numberOfLines={2}>{activeExercise.description}</Text>
          
          <View style={styles.muscleTags}>
            {activeExercise.target_muscle?.map((muscle: string, idx: number) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 3. DANH SÁCH BÀI TẬP (Nhóm theo ngày) */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainer}>
        <Text style={styles.courseTitle}>{courseData.title}</Text>
        <Text style={styles.courseLevel}>Cấp độ: <Text style={{ textTransform: 'capitalize' }}>{courseData.level}</Text></Text>

        {/* Lặp qua từng ngày (course_days) */}
        {courseData.course_days?.map((day: any) => (
          <View key={day.id} style={styles.daySection}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>Ngày {day.day_number}</Text>
              <Text style={styles.daySubtitle}>Tuần {day.week_number} • Giai đoạn {day.phase_number}</Text>
            </View>

            {/* Lặp qua các bài tập trong ngày đó */}
            {day.course_day_exercises
              ?.sort((a: any, b: any) => a.order_index - b.order_index) // Sắp xếp theo order_index
              .map((item: any) => {
                const ex = item.exercises;
                const isActive = activeExercise?.id === ex.id;

                return (
                  <TouchableOpacity 
                    key={ex.id} 
                    style={[styles.lessonCard, isActive && styles.lessonCardActive]}
                    onPress={() => setActiveExercise(ex)}
                    activeOpacity={0.8}
                  >
                    {/* Cột 1: Ảnh nhỏ */}
                    <ImageBackground 
                      source={{ uri: ex.img_list?.[0] || courseData.img_url }} 
                      style={styles.thumbnail} 
                      imageStyle={{ borderRadius: 8 }}
                    >
                      {isActive && (
                        <View style={styles.activeOverlay}>
                          <Ionicons name="volume-medium" size={20} color="#D4F93D" />
                        </View>
                      )}
                    </ImageBackground>

                    {/* Cột 2: Thông tin */}
                    <View style={styles.lessonInfo}>
                      <Text style={[styles.lessonTitle, isActive && styles.lessonTitleActive]} numberOfLines={1}>
                        {item.order_index}. {ex.title}
                      </Text>
                      <View style={styles.durationRow}>
                        <Ionicons name="time-outline" size={14} color={isActive ? "#D4F93D" : "#6B7280"} />
                        <Text style={[styles.durationText, isActive && styles.durationTextActive]}>
                          {formatDuration(ex.duration)}
                        </Text>
                      </View>
                    </View>

                    {/* Cột 3: Icon Play */}
                    <Ionicons 
                      name="play-circle" 
                      size={28} 
                      color={isActive ? "#D4F93D" : "#E5E7EB"} 
                    />
                  </TouchableOpacity>
                );
            })}
          </View>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  
  // Khu vực Player
  playerContainer: { width: '100%', height: 260, backgroundColor: '#000' },
  videoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  videoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  headerTop: { position: 'absolute', top: 0, left: 16, right: 16, flexDirection: 'row', zIndex: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  playCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#D4F93D', justifyContent: 'center', alignItems: 'center' },
  
  // Khu vực Thông tin bài tập đang phát
  playingInfo: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  playingTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 6 },
  playingDesc: { fontSize: 14, color: '#4B5563', marginBottom: 10, lineHeight: 20 },
  muscleTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: '600', color: '#4B5563', textTransform: 'capitalize' },
  
  // Khu vực Danh sách bài tập
  listContainer: { flex: 1, padding: 20 },
  courseTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 4 },
  courseLevel: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 20 },
  
  daySection: { marginBottom: 24 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 8 },
  dayTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  daySubtitle: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  
  lessonCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  lessonCardActive: { backgroundColor: '#111', borderColor: '#111' },
  
  thumbnail: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  activeOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  
  lessonInfo: { flex: 1, paddingHorizontal: 12, justifyContent: 'center' },
  lessonTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 6 },
  lessonTitleActive: { color: '#fff' },
  
  durationRow: { flexDirection: 'row', alignItems: 'center' },
  durationText: { fontSize: 13, color: '#6B7280', marginLeft: 4, fontWeight: '500' },
  durationTextActive: { color: '#D4F93D' },
});