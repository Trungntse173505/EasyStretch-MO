import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import axiosClient from '../../api/axiosClient';

const formatDuration = (s: number) => {
  const mins = Math.floor((Number(s) || 0) / 60);
  const secs = (Number(s) || 0) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getYouTubeID = (url: string) => {
  if (!url) return null;
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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return;
        setLoading(true);
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
        } else Alert.alert("Lỗi", "Không tìm thấy nội dung khóa học.");
      } catch (e) {
        Alert.alert("Lỗi", "Không thể tải dữ liệu.");
      } finally { setLoading(false); }
    };
    fetchCourse();
  }, [id]);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended" || state === "paused") setPlaying(false);
    if (state === "playing") setPlaying(true);
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#111" /></View>;
  if (!course) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Lỗi tải dữ liệu.</Text>
      <TouchableOpacity style={styles.backBtnRed} onPress={() => router.back()}><Text style={styles.backBtnText}>QUAY LẠI</Text></TouchableOpacity>
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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.bgLight}>
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
  bgLight: { flex: 1, backgroundColor: '#FAFAFA', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -20, paddingTop: 6 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  errorText: { color: '#64748B', fontWeight: '600', marginBottom: 20 },
  backBtnRed: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#111', borderRadius: 24 },
  backBtnText: { color: '#FFF', fontWeight: '900' },

  videoArea: { width: '100%', height: 280, backgroundColor: '#000', paddingBottom: 20 },
  cover: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  backContainer: { position: 'absolute', top: 0, left: 16, zIndex: 10 },
  circleBack: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', marginTop: 10 },

  infoBox: { padding: 24, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  playingTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 6, letterSpacing: -0.5 },
  playingDesc: { fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 16 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase' },

  playlistBox: { padding: 24 },
  courseName: { fontSize: 20, fontWeight: '900', color: '#111', marginBottom: 4 },
  levelLabel: { fontSize: 13, color: '#64748B', fontWeight: '700', textTransform: 'capitalize', marginBottom: 24 },

  dayGroup: { marginBottom: 30 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  dayLabel: { fontSize: 18, fontWeight: '900', color: '#111' },
  daySub: { fontSize: 12, color: '#64748B', fontWeight: '700' },

  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#F8FAFC' },
  exCardActive: { backgroundColor: '#111', borderColor: '#111', shadowColor: '#111', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 },
  thumb: { width: 68, height: 68, borderRadius: 12, backgroundColor: '#F1F5F9' },
  thumbOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  
  exMeta: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  exTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 4 },
  exTitleActive: { color: '#FFF' },
  exTime: { fontSize: 13, color: '#64748B', fontWeight: '700' },
  exTimeActive: { color: '#9CA3AF' }
});