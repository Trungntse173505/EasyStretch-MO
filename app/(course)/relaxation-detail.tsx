import { useExercisesClient } from '@/hooks/exercise/useExercisesClient';
import { transformMediaUrl } from '@/utils/mediaUtils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import axiosClient from '../../api/axiosClient';

const formatDuration = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function RelaxationDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, title, img_url } = useLocalSearchParams();
  const { exercises: allExercises, loading: loadingEx } = useExercisesClient();
  const [courseData, setCourseData] = useState<any>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return;
        setLoadingCourse(true);
        const res = await axiosClient.get(`/courses/all/${id}`);
        setCourseData(res.data?.data || res.data);
      } catch (e) {
        console.log("Lỗi tải giãn cơ:", e);
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchCourse();
  }, [id]);

  // Làm phẳng (flatten) các bài tập từ course_days
  const mappedExercises = useMemo(() => {
    if (!courseData?.course_days || !allExercises.length) return [];
    
    let list: any[] = [];
    courseData.course_days.forEach((day: any) => {
      if (day.course_day_exercises) {
        day.course_day_exercises.forEach((cde: any) => {
          // Ánh xạ exercise_id với allExercises
          const match = allExercises.find(ex => ex.id === cde.exercise_id);
          if (match) {
            list.push({
              ...match,
              order_index: cde.order_index
            });
          }
        });
      }
    });
    // Sắp xếp theo thứ tự order_index nếu có
    return list.sort((a, b) => a.order_index - b.order_index);
  }, [courseData, allExercises]);

  const totalDuration = mappedExercises.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalDurationMin = Math.floor(totalDuration / 60);

  const isLoading = loadingCourse || loadingEx;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* UPPER IMAGE COVER */}
        <ImageBackground
          source={{ uri: transformMediaUrl(img_url as string) || 'https://via.placeholder.com/800' }}
          style={styles.headerCover}
        >
          <View style={styles.overlay} />
          <SafeAreaView edges={['top']} style={styles.backButtonSafeArea}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
          </SafeAreaView>
        </ImageBackground>

        {/* CONTENT GÓC BO */}
        <View style={styles.contentContainer}>
          <View style={styles.dragPill} />
          <Text style={styles.title}>{title}</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#111" style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* THỐNG KÊ */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{totalDurationMin} phút</Text>
                  <Text style={styles.statLabel}>Thời lượng</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{mappedExercises.length}</Text>
                  <Text style={styles.statLabel}>Bài tập</Text>
                </View>
              </View>

              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Bài tập</Text>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={{color: '#3B82F6', fontWeight: '600'}}>Chi tiết</Text>
                </TouchableOpacity>
              </View>

              {/* DRAW THE EXERCISES */}
              <View style={styles.dayList}>
                {mappedExercises.map((ex, index) => (
                  <TouchableOpacity 
                    key={`${ex.id}-${index}`} 
                    style={styles.dayItem}
                    activeOpacity={0.7}
                    onPress={() => router.push({
                      pathname: "/(course)/relaxation-player",
                      params: { id: id, title: title, startIndex: index, mode: 'single' }
                    })}
                  >
                    <ImageBackground 
                      source={{ uri: transformMediaUrl(ex.img_list?.[0]) || 'https://via.placeholder.com/80' }} 
                      style={styles.thumb} 
                      imageStyle={{ borderRadius: 8 }}
                    />
                    <View style={styles.dayInfo}>
                      <Text style={styles.dayTitle}>{ex.title}</Text>
                      <Text style={styles.dayMeta}>{formatDuration(ex.duration)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ height: 100 }} />
            </>
          )}
        </View>
      </ScrollView>

      {/* FIXED BOTTOM ACTION */}
      {!isLoading && mappedExercises.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity 
            style={styles.playButton} 
            activeOpacity={0.9} 
            onPress={() => router.push({ 
              pathname: "/(course)/relaxation-player", 
              params: { id: id, title: title, startIndex: 0, mode: 'workout' } 
            })}
          >
            <Text style={styles.playButtonText}>Bắt đầu bài tập</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerCover: { width: '100%', height: 320 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.2)' },
  backButtonSafeArea: { position: 'absolute', top: 0, left: 20, zIndex: 10 },
  backButton: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },

  contentContainer: { flex: 1, minHeight: 600, marginTop: -40, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 15, elevation: 10 },
  dragPill: { width: 48, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 20 },

  title: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginBottom: 24, letterSpacing: -0.5 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: '#F8FAFC', paddingVertical: 18, marginHorizontal: 4, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#64748B', fontWeight: '600' },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B' },

  dayList: { gap: 16 },
  dayItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  thumb: { width: 60, height: 60, backgroundColor: '#F1F5F9', borderRadius: 8, marginRight: 16 },
  dayInfo: { flex: 1 },
  dayTitle: { fontSize: 16, fontWeight: '800', color: '#334155', marginBottom: 6 },
  dayMeta: { fontSize: 14, color: '#94A3B8', fontWeight: '600' },

  bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', paddingHorizontal: 24, paddingTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 20, borderWidth: 1, borderColor: '#F8FAFC' },
  playButton: { backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 100, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  playButtonText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
});
