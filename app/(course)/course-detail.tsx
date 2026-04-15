import { useCourseOwnership } from '@/hooks/course/useCourseOwnership';
import { transformMediaUrl } from '@/utils/mediaUtils';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, AppState, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosClient from '../../api/axiosClient';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id, title, img_url, isBought, courseLevel } = useLocalSearchParams();
  const { hasBought: apiHasBought, loading: loadingOwnership, checkOwnership } = useCourseOwnership();
  const [courseData, setCourseData] = useState<any>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [activeWeek, setActiveWeek] = useState(1);

  // Logic gộp: Hoặc là API check ra, hoặc là đi từ Tầng 1 (isBought=true)
  const hasBought = apiHasBought || isBought === 'true';

  useEffect(() => {
    // Nếu đã biết mười mươi là mua rồi (từ Tầng 1) thì không cần check API nữa cho mất công
    if (id && isBought !== 'true') {
      checkOwnership(id as string);
    }

    // Tự động kiểm tra lại khi user từ trình duyệt (web) quay trở lại app
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && id && isBought !== 'true') {
        checkOwnership(id as string);
      }
    });
    return () => subscription.remove();
  }, [id, checkOwnership, isBought]);

  useEffect(() => {
    const fetchFullCourse = async () => {
      try {
        if (!id) return;
        setLoadingCourse(true);
        const endpoint = courseLevel === 'relaxation' ? `/courses/all/${id}` : `/courses/payment/${id}`;
        const res = await axiosClient.get(endpoint);
        const data = res.data?.data || res.data;
        if (data) {
          setCourseData(data);
          setActiveWeek(data.course_days?.[0]?.week_number || 1);
        }
      } catch (e) {
        console.log("Lỗi tải thông tin lộ trình:", e);
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchFullCourse();
  }, [id]);

  const uniqueWeeks = useMemo(() => {
    if (!courseData?.course_days) return [];
    const weeks = courseData.course_days.map((d: any) => d.week_number).filter((w: any) => w != null);
    return Array.from(new Set(weeks)).sort((a: any, b: any) => a - b);
  }, [courseData]);

  const handleShowGuidance = async () => {
    const websiteUrl = "https://www.easystretch.click";

    Alert.alert(
      "Khóa học chưa kích hoạt",
      `Để bắt đầu tập luyện, bạn cần kích hoạt khóa học này.\n\nVui lòng truy cập website:\n${websiteUrl}\nđể quản lý tài khoản và đăng ký.`,
      [
        { text: "Đóng", style: "cancel" },
        {
          text: "Sao chép Website",
          onPress: async () => {
            await Clipboard.setStringAsync(websiteUrl);
            Alert.alert("Thành công", "Đã sao chép địa chỉ website. Bạn hãy mở trình duyệt (Safari/Chrome) và dán vào nhé!");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER COVER */}
      <ImageBackground source={{ uri: transformMediaUrl(img_url as string) || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop' }} style={styles.headerCover}>
        <View style={styles.overlay} />
        <SafeAreaView edges={['top']} style={styles.backButtonSafeArea}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>

      {/* CONTENT */}
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          <View style={styles.dragPill} />

          <View style={styles.tagWrap}>
            <Ionicons name="leaf" size={14} color="#10B981" style={{ marginRight: 6 }} />
            <Text style={styles.tagText}>Khóa phục hồi chuyên sâu</Text>
          </View>
          <Text style={styles.title}>{title}</Text>

          {/* SYLLABUS SECTION */}
          <View style={styles.syllabusSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Lộ trình học tập</Text>
              <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>{courseData?.course_days?.length || 0} ngày</Text>
              </View>
            </View>

            {loadingCourse ? (
              <ActivityIndicator color="#111" style={{ marginVertical: 30 }} />
            ) : (
              <>
                {/* Week Selector in Detail Screen */}
                <View style={styles.weekFilter}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                    {uniqueWeeks.map((week) => {
                      const isSelected = activeWeek === week;
                      return (
                        <TouchableOpacity
                        key={String(week)}
                          style={[styles.weekPill, isSelected && styles.weekPillActive]}
                          onPress={() => setActiveWeek(week as number)}
                        >
                          <Text style={[styles.weekPillText, isSelected && styles.weekPillTextActive]}>Tuần {String(week)}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Day List for active week */}
                <View style={styles.dayList}>
                  {courseData?.course_days?.filter((d: any) => d.week_number === activeWeek).map((day: any) => (
                    <View key={day.id} style={styles.dayItem}>
                      <View style={styles.dayNumberCircle}>
                        <Text style={styles.dayNumberText}>{day.day_number}</Text>
                      </View>
                      <View style={styles.dayInfo}>
                        <Text style={styles.dayTitle}>Ngày {day.day_number}: {day.course_day_exercises?.[0]?.exercises?.title || "Sẵn sàng tập luyện"}</Text>
                        <Text style={styles.dayMeta}>{day.course_day_exercises?.length || 0} bài tập • {Math.floor((day.course_day_exercises?.reduce((acc: any, curr: any) => acc + (curr.exercises?.duration || 0), 0)) / 60)} phút</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>

      {/* FLOATING ACTION BOTTOM */}
      <View style={styles.bottomBar}>
        {loadingOwnership ? (
          <ActivityIndicator size="large" color="#111" />
        ) : hasBought ? (
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ownedText}>Đã sở hữu</Text>
              <Text style={styles.readyText}>Sẵn sàng luyện tập</Text>
            </View>
            <TouchableOpacity style={styles.playButton} activeOpacity={0.9} onPress={() => router.push({ pathname: "/(course)/course-player", params: { id: id, title: title } })}>
              <Text style={styles.playButtonText}>Bắt đầu</Text>
              <Ionicons name="play" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.priceLabel}>Trạng thái</Text>
              <Text style={styles.notOwnedText}>Chưa kích hoạt</Text>
            </View>
            <TouchableOpacity style={styles.buyButton} onPress={handleShowGuidance} activeOpacity={0.9}>
              <Text style={styles.buyButtonText}>Kích hoạt trên Web</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerCover: { width: '100%', height: 380 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.4)' },
  backButtonSafeArea: { position: 'absolute', top: 0, left: 20, zIndex: 10 },
  backButton: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },

  contentContainer: { flex: 1, marginTop: -50, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 15, elevation: 10 },
  dragPill: { width: 48, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 28 },

  tagWrap: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#ECFDF5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginBottom: 16 },
  tagText: { fontSize: 13, fontWeight: '800', color: '#10B981' },

  title: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginBottom: 12, lineHeight: 36, letterSpacing: -0.5 },
  description: { fontSize: 16, color: '#64748B', lineHeight: 26, marginBottom: 28 },

  sectionHeader: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  featureBox: { gap: 14, backgroundColor: '#F8FAFC', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIconWrap: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  featureText: { fontSize: 15, color: '#334155', fontWeight: '600', flexShrink: 1 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 18, marginHorizontal: 4, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  statIcon: { marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },

  bottomBar: { position: 'absolute', bottom: 10, width: '100%', backgroundColor: '#FFF', paddingHorizontal: 24, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 24 : 40, borderTopLeftRadius: 36, borderTopRightRadius: 36, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 20, borderWidth: 1, borderColor: '#F8FAFC' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  ownedText: { fontSize: 14, color: '#10B981', fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
  readyText: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  playButton: { backgroundColor: '#D4F93D', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingVertical: 18, borderRadius: 100, shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  playButtonText: { color: '#1E293B', fontSize: 16, fontWeight: '900' },

  priceLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  notOwnedText: { fontSize: 22, fontWeight: '900', color: '#64748B', letterSpacing: -0.5 },
  buyButton: { backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 18, borderRadius: 100, shadowColor: '#1E293B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  buyButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

  // New Syllabus Styles
  syllabusSection: { marginTop: 10 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  badgeCount: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '800', color: '#64748B' },

  weekFilter: { marginBottom: 24 },
  weekPill: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 100, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' },
  weekPillActive: { backgroundColor: '#D4F93D', borderColor: '#D4F93D', shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  weekPillText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  weekPillTextActive: { color: '#1E293B' },

  dayList: { gap: 16 },
  dayItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#F8FAFC', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 6, elevation: 1 },
  dayNumberCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  dayNumberText: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  dayInfo: { flex: 1 },
  dayTitle: { fontSize: 15, fontWeight: '800', color: '#334155', marginBottom: 4 },
  dayMeta: { fontSize: 12, color: '#94A3B8', fontWeight: '600' }
});