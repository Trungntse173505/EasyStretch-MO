import { useUser } from "@/hooks/auth/useUser";
import { useCourses } from "@/hooks/course/useCourses";
import { useCoursesRecover } from "@/hooks/course/useCoursesRecover";
import { useCoursesRelaxation } from "@/hooks/course/useCoursesRelaxation";
import { useCoursesRelaxationFree } from "@/hooks/course/useCoursesRelaxationFree";
import { getCourseLevelLabel } from "@/utils/courseUtils";
import { transformMediaUrl } from "@/utils/mediaUtils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CourseListScreen() {
  const router = useRouter();
  const { title, type } = useLocalSearchParams();
  const [searchText, setSearchText] = useState("");
  const { user } = useUser();
  const isSubscriber = user?.is_subscriber === "active";

  const coursesAll = useCourses();
  const recoverHook = useCoursesRecover();
  const relaxHook = useCoursesRelaxation();
  const relaxFreeHook = useCoursesRelaxationFree();

  const loading = coursesAll.loading || recoverHook.loading || relaxHook.loading || relaxFreeHook.loading;

  // Lấy dữ liệu nguồn dựa trên 'type'
  const sourceData = useMemo(() => {
    if (type === 'bought') return coursesAll.boughtCourses;
    if (type === 'explore' || type === 'recover') return recoverHook.courses;
    if (type === 'relaxation') {
      return isSubscriber ? relaxFreeHook.courses : relaxHook.courses;
    }
    return coursesAll.courses;
  }, [type, coursesAll.boughtCourses, coursesAll.courses, recoverHook.courses, relaxFreeHook.courses, relaxHook.courses, isSubscriber]);

  // Logic tìm kiếm theo tên
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return sourceData;
    return sourceData.filter(item =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, sourceData]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.9}
      onPress={() => router.push({
        pathname: type === 'relaxation' || item.level === 'relaxation' ? "/(course)/relaxation-detail" : "/(course)/course-detail",
        params: {
          id: item.id,
          title: item.title,
          price: item.price,
          img_url: item.img_url,
          isBought: type === 'bought' || (type === 'relaxation' && isSubscriber) ? 'true' : 'false',
          courseLevel: item.level
        }
      })}
    >
      <ImageBackground source={{ uri: transformMediaUrl(item.img_url) || 'https://via.placeholder.com/400' }} style={styles.courseBg} imageStyle={{ borderRadius: 24 }}>
        <View style={styles.overlay} />
        <View style={styles.cardHeader}>
          <View style={styles.levelBadge}>
            <Ionicons name="flash" size={14} color="#111" />
            <Text style={styles.levelText}>{getCourseLevelLabel(item.level)}</Text>
          </View>
          <View style={styles.playBtn}>
            <Ionicons name="play" size={16} color="#111" style={{ marginLeft: 2 }} />
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>
              {type === 'bought' ? "Vào học ngay" : (item.price > 0 ? `${item.price.toLocaleString('vi-VN')} đ` : 'Miễn phí')}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  ), [type, isSubscriber, router]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || "Khóa Học"}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tên khóa học..."
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#D4F93D" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="search-outline" size={64} color="#E2E8F0" />
              <Text style={styles.emptyText}>Không tìm thấy khóa học nào</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "900", color: "#111" },
  
  searchContainer: { paddingHorizontal: 20, paddingBottom: 15 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "600",
  },

  listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  courseCard: { height: 160, marginBottom: 20, borderRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  courseBg: { flex: 1, justifyContent: "space-between", padding: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 24 },
  
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 },
  levelBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#D4F93D", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  levelText: { fontSize: 11, fontWeight: "900", color: "#111", textTransform: "capitalize" },
  playBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.9)", justifyContent: "center", alignItems: "center" },

  cardFooter: { zIndex: 1 },
  courseTitle: { color: "#FFF", fontSize: 18, fontWeight: "900", marginBottom: 8, lineHeight: 24 },
  priceTag: { alignSelf: "flex-start", backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  priceText: { color: "#D4F93D", fontSize: 13, fontWeight: "800" },

  centered: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, color: "#94A3B8", fontWeight: "600" },
});
