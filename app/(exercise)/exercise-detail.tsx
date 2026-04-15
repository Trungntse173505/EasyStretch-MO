import { useExerciseDetail } from '@/hooks/exercise/useExerciseDetail';
import { transformMediaUrl } from '@/utils/mediaUtils';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState, useEffect } from 'react';
import { ActivityIndicator, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { exercise, loading, error } = useExerciseDetail(id as string);
  const [playing, setPlaying] = useState(false);

  const getYouTubeID = (url: any) => {
    if (!url) return null;
    const urlStr = Array.isArray(url) ? url[0] : url;
    if (typeof urlStr !== 'string') return null;
    const match = urlStr.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
      alert("Chúc mừng bạn đã hoàn thành bài tập! 🎉");
    }
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#111" /></View>;
  if (error || !exercise) return <View style={styles.center}><Text style={styles.errorText}>{error || 'Lỗi dữ liệu'}</Text></View>;

  const videoUrlStr = Array.isArray(exercise.video_url) ? exercise.video_url[0] : exercise.video_url;
  const videoId = getYouTubeID(videoUrlStr);
  const isDirectVideo = !videoId && videoUrlStr;

  const player = useVideoPlayer(playing && isDirectVideo ? (transformMediaUrl(videoUrlStr, 'video') ?? '') : '', (player) => {
    player.loop = true;
    player.bufferOptions = {
      preferredForwardBufferDuration: 30, // Tối ưu cho Cloudinary
      maxBufferBytes: 50 * 1024 * 1024,   // Giới hạn 50MB
    };
    if (playing) player.play();
  });

  useEffect(() => {
    if (isDirectVideo) {
      if (playing) player.play();
      else player.pause();
    }
  }, [playing, player, isDirectVideo]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: playing ? 40 : 130 }}>
        {/* HEADER / PLAYER */}
        <View style={styles.headerArea}>
          {playing && videoId ? (
            <View style={styles.videoWrap}>
               <YoutubePlayer height={350} play={true} videoId={videoId} onChangeState={onStateChange} />
            </View>
          ) : playing && isDirectVideo ? (
            <View style={styles.videoWrap}>
              <VideoView
                style={{ width: '100%', height: 350 }}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
              />
            </View>
          ) : (
            <ImageBackground source={{ uri: transformMediaUrl(exercise.img_list?.[0]) || 'https://via.placeholder.com/800x600' }} style={styles.cover}>
              <View style={styles.overlay} />
              <TouchableOpacity style={styles.playCenterBtn} onPress={() => setPlaying(true)} activeOpacity={0.85}>
                 <Ionicons name="play" size={36} color="#111" style={{marginLeft: 4}} />
              </TouchableOpacity>
            </ImageBackground>
          )}

          <SafeAreaView style={styles.backBtnWrapper} edges={['top']}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={24} color="#111" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* DETAILS */}
        <View style={styles.content}>
           <View style={styles.dragPill} />
           
           <View style={styles.metaRow}>
             <View style={styles.typeBadge}><Text style={styles.typeText}>{exercise.type}</Text></View>
             <View style={styles.timeTag}>
                <Ionicons name="time" size={16} color="#64748B" />
                <Text style={styles.timeText}>{Math.floor(exercise.duration / 60)} phút {exercise.duration % 60} s</Text>
             </View>
           </View>

           <Text style={styles.title}>{exercise.title}</Text>
           <Text style={styles.desc}>{exercise.description}</Text>

           <Text style={styles.subTitle}>Nhóm cơ tác động</Text>
           <View style={styles.muscleWrap}>
             {exercise.target_muscle?.map((m: string, i: number) => (
                <View key={i} style={styles.muscleTag}><Text style={styles.muscleText}>{m}</Text></View>
             ))}
           </View>
        </View>
      </ScrollView>

      {/* FOOTER BUTTON */}
      {!playing && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setPlaying(true)} activeOpacity={0.9}>
            <Ionicons name="play" size={22} color="#111" />
            <Text style={styles.actionBtnText}>Bắt đầu tập luyện ngay</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  errorText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },

  headerArea: { width: '100%', height: 350, backgroundColor: '#000' },
  videoWrap: { width: '100%', height: 350, justifyContent: 'center' },
  cover: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  playCenterBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#D4F93D', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  
  backBtnWrapper: { position: 'absolute', top: 0, left: 16, zIndex: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.95)', justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },

  content: { flex: 1, marginTop: -35, backgroundColor: '#FFF', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 24, paddingTop: 16 },
  dragPill: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 24 },
  
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  typeBadge: { backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  typeText: { color: '#FFF', fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  timeTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  timeText: { fontSize: 14, color: '#475569', fontWeight: '700' },

  title: { fontSize: 28, fontWeight: '900', color: '#111', marginBottom: 16, lineHeight: 36, letterSpacing: -0.5 },
  desc: { fontSize: 16, color: '#475569', lineHeight: 26, marginBottom: 28 },

  subTitle: { fontSize: 19, fontWeight: '900', color: '#111', marginBottom: 14 },
  muscleWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  muscleTag: { backgroundColor: '#F1F5F9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  muscleText: { fontSize: 14, color: '#334155', fontWeight: '700' },

  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', paddingHorizontal: 24, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 24 : 40, borderTopWidth: 1, borderTopColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 15 },
  actionBtn: { backgroundColor: '#D4F93D', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingVertical: 18, borderRadius: 30, shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  actionBtnText: { fontSize: 18, fontWeight: '900', color: '#111' }
});