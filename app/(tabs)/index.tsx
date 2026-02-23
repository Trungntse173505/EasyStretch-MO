import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import Hooks
import { useCourses } from "../../hooks/course/useCourses";
import { useExercisesClient } from "../../hooks/exercise/useExercisesClient"; // Hook mới

export default function HomeScreen() {
  const router = useRouter();

  // Gọi API lấy Khóa học và Bài tập
  const { courses, loading: loadingCourses, error: errorCourses, refetch: refetchCourses } = useCourses();
  const { exercises, loading: loadingEx, error: errorEx, refetch: refetchEx } = useExercisesClient();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Làm mới cả 2 API
    await Promise.all([refetchCourses?.(), refetchEx?.()]);
    setRefreshing(false);
  }, [refetchCourses, refetchEx]);

  // Hàm phụ trợ tính phút từ giây
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    return m > 0 ? `${m} phút` : `${seconds} giây`;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4F93D" colors={["#D4F93D"]} />
        }
      >

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Chào buổi sáng 🔥</Text>
          <View style={styles.titleRow}>
            <Text style={styles.appName}>EasyStretch</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>Ráng tập lưng 👑</Text>
            </View>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput placeholder="Tìm kiếm" placeholderTextColor="#9CA3AF" style={styles.searchInput} />
        </View>

        {/* PHẦN 1: KHÓA TẬP LUYỆN PHỤ HỒI */}
        <Text style={styles.sectionTitle}>Khóa Tập Luyện Phục Hồi</Text>
        {loadingCourses && !refreshing ? (
          <ActivityIndicator size="small" color="#D4F93D" style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {courses.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.popularCard}
                onPress={() => router.push({
                  pathname: "/(course)/course-detail",
                  params: { id: item.id, title: item.title, price: item.price, img_url: item.img_url }
                })}
              >
                <ImageBackground source={{ uri: item.img_url }} style={styles.popularBg} imageStyle={{ borderRadius: 24 }}>
                  <View style={styles.cardOverlay} />
                  <View style={styles.playButton}><Ionicons name="play" size={16} color="#000" /></View>
                  <View>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.cardTags}>
                      <View style={styles.tag}><Ionicons name="flash" size={10} color="#111" /><Text style={styles.tagText}>{item.level}</Text></View>
                      <View style={styles.tag}><Text style={styles.tagText}>{item.price > 0 ? `${item.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}</Text></View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* PHẦN 2: BÀI TẬP GIẢM ĐAU MỎI VAI GÁY (Dữ liệu từ API Exercises) */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Bài Tập Giảm Đau Mỏi Vai Gáy</Text>
        <View style={styles.verticalList}>
          {loadingEx && !refreshing ? (
            <ActivityIndicator size="small" color="#D4F93D" />
          ) : (
            exercises.map((item) => (
              <TouchableOpacity key={item.id} style={styles.scheduleItem} activeOpacity={0.9} onPress={() => router.push({
                pathname: "/(exercise)/exercise-detail",
                params: { id: item.id }
              })}
              >
                <Image source={{ uri: item.img_list?.[0] }} style={styles.scheduleImage} />
                <View style={styles.scheduleInfo}>
                  <View style={styles.scheduleHeader}>
                    <Text style={styles.scheduleTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.levelTag}><Text style={styles.levelText}>{item.type}</Text></View>
                  </View>
                  <Text style={styles.scheduleSub}>Thời gian: {formatTime(item.duration)}</Text>

                  {/* Hiển thị cơ tác động từ mảng target_muscle */}
                  <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                    {item.target_muscle.map((muscle, idx) => (
                      <View key={idx} style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 6, borderRadius: 4 }}>
                        <Text style={{ fontSize: 10, color: '#6B7280' }}>{muscle}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  header: { marginBottom: 16 },
  greeting: { fontSize: 14, color: "#6B7280", marginBottom: 4, fontWeight: "600" },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  appName: { fontSize: 26, fontWeight: "900", color: "#111" },
  statusPill: { backgroundColor: "#D4F93D", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "700", color: "#111" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", borderRadius: 16, paddingHorizontal: 16, height: 50, marginBottom: 24, borderWidth: 1, borderColor: "#E5E7EB" },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: "500", color: "#111" },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 12 },
  horizontalList: { overflow: "visible" },
  popularCard: { width: 260, height: 160, marginRight: 16, borderRadius: 24 },
  popularBg: { flex: 1, justifyContent: "space-between", padding: 16 },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 24 },
  playButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#D4F93D", justifyContent: "center", alignItems: "center", alignSelf: "flex-end" },
  cardTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 8 },
  cardTags: { flexDirection: "row", gap: 8 },
  tag: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#fff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: "700", color: "#111", textTransform: 'capitalize' },
  verticalList: { gap: 16 },
  scheduleItem: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 20, padding: 12, borderWidth: 1, borderColor: "#F3F4F6", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  scheduleImage: { width: 80, height: 80, borderRadius: 16, backgroundColor: "#eee" },
  scheduleInfo: { flex: 1, marginLeft: 14, justifyContent: "center" },
  scheduleHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  scheduleTitle: { fontSize: 16, fontWeight: "800", color: "#111", flex: 1, marginRight: 4 },
  levelTag: { backgroundColor: "#111", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  levelText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  scheduleSub: { fontSize: 12, color: "#6B7280" },
});