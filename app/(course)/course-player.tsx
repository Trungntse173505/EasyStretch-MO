import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import axiosClient from '../../api/axiosClient';

const formatDuration = (s: number) => {
  const mins = Math.floor((Number(s) || 0) / 60);
  const secs = (Number(s) || 0) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getYouTubeID = (url: any) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function CoursePlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<any>(null);
  const [activeEx, setActiveEx] = useState<any>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State mới để lưu thông báo lỗi

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return;
        setLoading(true);
        setErrorMsg(null);
        const res = await axiosClient.get(`/courses/payment/${id}`);
        const data = res.data?.data || res.data;

        if (data?.id) {
          setCourse(data);
          const firstExItem = data.course_days?.[0]?.course_day_exercises?.[0];
          if (firstExItem?.exercises) {
            setActiveEx(firstExItem.exercises);
            setActiveKey(`${data.course_days[0].id}-${firstExItem.exercises.id}-${firstExItem.order_index}`);
            setPlaying(false);
          }
        } else {
            setErrorMsg("Không tìm thấy nội dung khóa học.");
        }
      } catch (e: any) {
        // Xử lý lỗi từ API, đặc biệt là lỗi 403/400 khi chưa kích hoạt khóa học
        if (e.response?.status === 403 || e.response?.status === 400 || e.response?.status === 404) {
            setErrorMsg("Bạn chưa kích hoạt khóa học này. Vui lòng quay lại và kiểm tra trên Website.");
        } else {
            setErrorMsg("Không thể tải dữ liệu lúc này. Vui lòng thử lại sau.");
        }
      } finally { setLoading(false); }
    };
    fetchCourse();
  }, [id]);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended" || state === "paused") setPlaying(false);
    if (state === "playing") setPlaying(true);
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#111" /></View>;
  
  // Hiển thị giao diện lỗi nếu có errorMsg hoặc không có course
  if (errorMsg || !course) return (
    <View style={styles.center}>
      <Ionicons name="alert-circle-outline" size={64} color="#64748B" style={{ marginBottom: 16 }} />
      <Text style={styles.errorText}>{errorMsg || "Lỗi tải dữ liệu."}</Text>
      <TouchableOpacity style={styles.backBtnRed} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>QUAY LẠI</Text>
      </TouchableOpacity>
    </View>
  );

  const videoId = getYouTubeID(activeEx?.video_url);

  return (
    <View style={styles.container}>
      {/* VIDEO PLAYER AREA */}
      <View style={styles.videoArea}>
        {videoId ? (
          <YoutubePlayer height={260} play={playing} videoId={videoId} onChangeState={onStateChange} />
        ) : (
          <ImageBackground source={{ uri: activeEx?.img_list?.[0] || 'https://via.placeholder.com/800x400' }} style={styles.cover}>
             <View style={styles.overlay} />
             <Text style={{color: '#FFF', fontWeight: '800'}}>Chưa có Video</Text>
          </ImageBackground>
        )}
        <SafeAreaView edges={['top']} style={styles.backContainer}>
          <TouchableOpacity style={styles.circleBack} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-down" size={24} color="#FFF" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.bgLight} contentContainerStyle={{paddingTop: 12}}>
        <View style={styles.dragPill} />
        
        {/* CURRENT EXERCISE INFO */}
        <View style={styles.infoBox}>
          <Text style={styles.playingTitle}>{activeEx?.title || "Đang tải bài tập..."}</Text>
          <Text style={styles.playingDesc} numberOfLines={2}>{activeEx?.description}</Text>
          <View style={styles.tagWrap}>
            {activeEx?.target_muscle?.map((m: string, i: number) => (
               <View key={i} style={styles.tag}><Text style={styles.tagText}>{m}</Text></View>
            ))}
          </View>
        </View>

        {/* PLAYLIST */}
        <View style={styles.playlistBox}>
          <Text style={styles.courseName}>{course.title}</Text>
          <Text style={styles.levelLabel}>Cấp độ: {course.level}</Text>

          {course.course_days?.map((day: any) => (
            <View key={day.id} style={styles.dayGroup}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayLabel}>Ngày {day.day_number}</Text>
                <Text style={styles.daySub}>Tuần {day.week_number} • Giai đoạn {day.phase_number}</Text>
              </View>

              {day.course_day_exercises?.sort((a: any, b: any) => a.order_index - b.order_index).map((item: any) => {
                const ex = item.exercises;
                if (!ex) return null;
                const k = `${day.id}-${ex.id}-${item.order_index}`;
                const isActive = activeKey === k;
                
                return (
                  <TouchableOpacity 
                    key={k} 
                    style={[styles.exCard, isActive && styles.exCardActive]}
                    onPress={() => { setActiveEx(ex); setActiveKey(k); setPlaying(true); }}
                    activeOpacity={0.8}
                  >
                    <ImageBackground source={{ uri: ex.img_list?.[0] || 'https://via.placeholder.com/100' }} style={styles.thumb} imageStyle={{borderRadius: 12}}>
                      {isActive && <View style={styles.thumbOverlay}><Ionicons name={playing ? "volume-high" : "pause"} size={22} color="#D4F93D" /></View>}
                    </ImageBackground>
                    <View style={styles.exMeta}>
                      <Text style={[styles.exTitle, isActive && styles.exTitleActive]}>{item.order_index}. {ex.title}</Text>
                      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                         <Ionicons name="time" size={12} color={isActive ? "#9CA3AF" : "#94A3B8"} />
                         <Text style={[styles.exTime, isActive && styles.exTimeActive]}> {formatDuration(ex.duration)}</Text>
                      </View>
                    </View>
                    <Ionicons name={isActive ? "play-circle" : "play-circle-outline"} size={32} color={isActive ? "#D4F93D" : "#CBD5E1"} />
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
        <View style={{height: 60}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgLight: { flex: 1, backgroundColor: '#F8FAFC', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -32, paddingTop: 6, shadowColor: '#000', shadowOffset: {width: 0, height: -6}, shadowOpacity: 0.1, shadowRadius: 15, elevation: 15 },
  dragPill: { width: 48, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 16 },
  
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 24 },
  errorText: { color: '#64748B', fontSize: 16, fontWeight: '600', marginBottom: 24, textAlign: 'center', lineHeight: 24 },
  backBtnRed: { paddingHorizontal: 32, paddingVertical: 14, backgroundColor: '#1E293B', borderRadius: 100 },
  backBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },

  videoArea: { width: '100%', height: 300, backgroundColor: '#000', paddingBottom: 32 },
  cover: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.6)' },
  backContainer: { position: 'absolute', top: 0, left: 16, zIndex: 10 },
  circleBack: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginTop: 10 },

  infoBox: { padding: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 24, shadowColor: '#000', shadowOffset: {width:0,height:4}, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginBottom: 16 },
  playingTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginBottom: 8, letterSpacing: -0.5 },
  playingDesc: { fontSize: 15, color: '#475569', lineHeight: 24, marginBottom: 16 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { fontSize: 12, fontWeight: '800', color: '#3B82F6', textTransform: 'uppercase' },

  playlistBox: { paddingHorizontal: 24, paddingTop: 8 },
  courseName: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 6 },
  levelLabel: { fontSize: 14, color: '#10B981', fontWeight: '800', textTransform: 'uppercase', marginBottom: 28 },

  dayGroup: { marginBottom: 32 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  dayLabel: { fontSize: 19, fontWeight: '900', color: '#1E293B' },
  daySub: { fontSize: 13, color: '#64748B', fontWeight: '700' },

  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 24, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#F8FAFC' },
  exCardActive: { backgroundColor: '#1E293B', borderColor: '#1E293B', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8 },
  thumb: { width: 72, height: 72, borderRadius: 16, backgroundColor: '#F1F5F9' },
  thumbOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', alignItems: 'center', borderRadius: 16 },
  
  exMeta: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  exTitle: { fontSize: 16, fontWeight: '800', color: '#334155', marginBottom: 6, lineHeight: 22 },
  exTitleActive: { color: '#FFF' },
  exTime: { fontSize: 13, color: '#64748B', fontWeight: '700' },
  exTimeActive: { color: '#CBD5E1' }
});