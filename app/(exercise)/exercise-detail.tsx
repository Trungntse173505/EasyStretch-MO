import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react'; // Thêm useState, useCallback
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe'; // Import thư viện video
import { useExerciseDetail } from '../../hooks/exercise/useExerciseDetail';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { exercise, loading, error } = useExerciseDetail(id as string);
  
  // State để quản lý việc phát video
  const [playing, setPlaying] = useState(false);

  // Hàm bóc tách ID từ URL YouTube (hỗ trợ cả link ngắn và link đầy đủ)
  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
      alert("Chúc mừng bạn đã hoàn thành bài tập! 🎉");
    }
  }, []);

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#D4F93D" /></View>
  );

  if (error || !exercise) return (
    <View style={styles.center}><Text style={{color: 'red'}}>{error || 'Lỗi dữ liệu'}</Text></View>
  );

  const videoId = getYouTubeID(exercise.video_url);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header Section: Chuyển đổi giữa Image và Video Player */}
        <View style={styles.imageHeader}>
          {playing && videoId ? (
            <View style={styles.videoWrapper}>
              <YoutubePlayer
                height={350}
                play={true}
                videoId={videoId}
                onChange={onStateChange}
              />
            </View>
          ) : (
            <>
              <Image source={{ uri: exercise.img_list?.[0] }} style={styles.coverImage} />
              <View style={styles.imageOverlay}>
                <TouchableOpacity style={styles.mainPlayBtn} onPress={() => setPlaying(true)}>
                  <Ionicons name="play" size={40} color="#000" />
                </TouchableOpacity>
              </View>
            </>
          )}

          <SafeAreaView style={styles.backBtnContainer} edges={['top']}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.infoRow}>
            <View style={styles.typeTag}><Text style={styles.typeText}>{exercise.type}</Text></View>
            <View style={styles.durationTag}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.durationText}>
                {Math.floor(exercise.duration / 60)} phút {exercise.duration % 60} giây
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{exercise.title}</Text>
          <Text style={styles.description}>{exercise.description}</Text>

          <Text style={styles.subTitle}>Nhóm cơ tác động</Text>
          <View style={styles.muscleContainer}>
            {exercise.target_muscle.map((muscle, index) => (
              <View key={index} style={styles.muscleTag}>
                <Text style={styles.muscleText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Button: Nếu đang phát thì hiện nút dừng, nếu không thì hiện nút bắt đầu */}
      {!playing && (
        <SafeAreaView style={styles.footer}>
          <TouchableOpacity style={styles.playButton} onPress={() => setPlaying(true)}>
            <Ionicons name="play" size={20} color="#000" style={{marginRight: 8}} />
            <Text style={styles.playButtonText}>Bắt đầu luyện tập</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageHeader: { height: 350, width: '100%', backgroundColor: '#000' },
  videoWrapper: { width: '100%', height: 350, justifyContent: 'center' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  mainPlayBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#D4F93D', justifyContent: 'center', alignItems: 'center', elevation: 10 },
  backBtnContainer: { position: 'absolute', top: 10, left: 20 },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  content: { padding: 24, marginTop: -30, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  typeTag: { backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  typeText: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  durationTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  durationText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '900', color: '#111', marginBottom: 12 },
  description: { fontSize: 16, color: '#4B5563', lineHeight: 24, marginBottom: 24 },
  subTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 12 },
  muscleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  muscleTag: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  muscleText: { fontSize: 14, color: '#374151', fontWeight: '600' },
  footer: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: 24, paddingBottom: 20 },
  playButton: { backgroundColor: '#D4F93D', height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  playButtonText: { fontSize: 18, fontWeight: '800', color: '#111' },
});