import { useCourses } from "@/hooks/course/useCourses";
import { useExercisesClient } from "@/hooks/exercise/useExercisesClient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { courses, loading: loadingCourses, refetch: refetchCourses } = useCourses();
  const { exercises, loading: loadingEx, refetch: refetchEx } = useExercisesClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchCourses?.(), refetchEx?.()]);
    setRefreshing(false);
  }, [refetchCourses, refetchEx]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    return m > 0 ? `${m} phút` : `${seconds} s`;
  };

  const SectionHeader = ({ title, onSeeAll }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onSeeAll}>
        <Text style={styles.seeAll}>Tất cả</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4F93D" colors={["#D4F93D"]} />}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={styles.avatarWrap}>
              <Ionicons name="person" size={20} color="#D4F93D" />
            </View>
            <View>
              <Text style={styles.greeting}>Chào ngày mới 👋</Text>
              <Text style={styles.appName}>EasyStretch</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={24} color="#111" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* SECTION 1: KHÓA TẬP LUYỆN */}
        <SectionHeader title="Khóa Tập Phục Hồi" />
        {loadingCourses && !refreshing ? (
          <ActivityIndicator size="small" color="#111" style={{ marginVertical: 40 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingRight: 20 }}>
            {courses.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.courseCard}
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: "/(course)/course-detail", params: { id: item.id, title: item.title, price: item.price, img_url: item.img_url } })}
              >
                <ImageBackground source={{ uri: item.img_url }} style={styles.courseBg} imageStyle={{ borderRadius: 28 }}>
                  <View style={styles.overlay} />

                  <View style={styles.courseTop}>
                    <View style={styles.levelBadge}>
                      <Ionicons name="flash" size={14} color="#111" />
                      <Text style={styles.levelText}>{item.level}</Text>
                    </View>
                    <View style={styles.playBtn}><Ionicons name="play" size={16} color="#111" style={{ marginLeft: 2 }} /></View>
                  </View>

                  <View style={styles.courseBottom}>
                    <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.priceTag}>
                      <Text style={styles.priceText}>{item.price > 0 ? `${item.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* SECTION 2: BÀI TẬP GỢI Ý */}
        <View style={{ marginTop: 35 }}>
          <SectionHeader title="Gợi Ý Cho Bạn" />
          <View style={styles.verticalList}>
            {loadingEx && !refreshing ? (
              <ActivityIndicator size="small" color="#111" style={{ marginTop: 20 }} />
            ) : (
              exercises.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.exCard}
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: "/(exercise)/exercise-detail", params: { id: item.id } })}
                >
                  <Image source={{ uri: item.img_list?.[0] }} style={styles.exImg} />
                  <View style={styles.exInfo}>
                    <Text style={styles.exTitle} numberOfLines={1}>{item.title}</Text>

                    <View style={styles.exMetaRow}>
                      <View style={styles.exTypeBadge}><Text style={styles.exTypeText}>{item.type}</Text></View>
                      <View style={styles.durationWrap}>
                        <Ionicons name="time" size={14} color="#64748B" />
                        <Text style={styles.durationText}>{formatTime(item.duration)}</Text>
                      </View>
                    </View>

                    <View style={styles.tagsContainer}>
                      {item.target_muscle.map((m, i) => (
                        <View key={i} style={styles.tag}><Text style={styles.tagText}>{m}</Text></View>
                      ))}
                    </View>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={32} color="#D4F93D" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", marginBottom: 30 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  avatarWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  greeting: { fontSize: 13, color: "#64748B", marginBottom: 2, fontWeight: "600", textTransform: 'uppercase', letterSpacing: 0.5 },
  appName: { fontSize: 24, fontWeight: "900", color: "#111", letterSpacing: -0.5 },
  iconBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  badge: { position: "absolute", top: 12, right: 14, width: 10, height: 10, borderRadius: 5, backgroundColor: "#EF4444", borderWidth: 2, borderColor: "#FFF" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: "#111", letterSpacing: -0.5 },
  seeAll: { fontSize: 14, fontWeight: "800", color: "#8B5CF6", marginBottom: 2 },

  horizontalScroll: { overflow: "visible" },
  courseCard: { width: 280, height: 200, marginRight: 20, borderRadius: 28, shadowColor: "#111", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 8, marginBottom: 10 },
  courseBg: { flex: 1, justifyContent: "space-between", padding: 20 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 28 },

  courseTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 },
  levelBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#D4F93D", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  levelText: { fontSize: 12, fontWeight: "900", color: "#111", textTransform: "capitalize" },
  playBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.95)", justifyContent: "center", alignItems: "center" },

  courseBottom: { zIndex: 1 },
  courseTitle: { color: "#FFF", fontSize: 22, fontWeight: "900", marginBottom: 12, lineHeight: 30 },
  priceTag: { alignSelf: "flex-start", backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  priceText: { color: "#D4F93D", fontSize: 14, fontWeight: "800" },

  verticalList: { gap: 16 },
  exCard: { flexDirection: "row", alignItems: 'center', backgroundColor: "#FFF", borderRadius: 24, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  exImg: { width: 90, height: 90, borderRadius: 20, backgroundColor: "#F3F4F6" },
  exInfo: { flex: 1, marginLeft: 16, justifyContent: "center" },
  exTitle: { fontSize: 17, fontWeight: "900", color: "#111", marginBottom: 8 },

  exMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  exTypeBadge: { backgroundColor: "#F8FAFC", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  exTypeText: { color: "#475569", fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  durationWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  durationText: { fontSize: 13, color: "#64748B", fontWeight: "700" },

  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { backgroundColor: "rgba(212,249,61,0.15)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, color: "#111", fontWeight: "800" },
});