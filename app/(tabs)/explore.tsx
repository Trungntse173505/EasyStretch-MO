import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Explore</Text>

        {/* BANNER */}
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800" }}
            style={styles.banner}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.bannerOverlay} />
            <Text style={styles.bannerText}>Chương trình tập{"\n"}luyện giãn cơ</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Xem thêm</Text>
              <Ionicons name="chevron-forward" size={12} color="#D4F93D" />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/* PHẦN DINH DƯỠNG (MỚI) */}
        <Text style={styles.sectionTitle}>Dinh Dưỡng</Text>
        <TouchableOpacity style={styles.nutritionCard}>
          {/* Cột chỉ số bên trái */}
          <View style={styles.nutritionStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>25g</Text>
              <Text style={styles.statLabel}>Protein</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>16g</Text>
              <Text style={styles.statLabel}>Fat</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>45g</Text>
              <Text style={styles.statLabel}>Carbs</Text>
            </View>
          </View>

          {/* Hình ảnh bên phải */}
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" }} 
            style={styles.nutritionImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* PHÙ HỢP NHẤT */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Phù hợp nhất cho bạn</Text>
        <View style={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <TouchableOpacity key={i} style={styles.gridItem}>
              <Image 
                source={{ uri: `https://picsum.photos/id/${i+20}/200/200` }} 
                style={styles.gridImage} 
              />
              <Text style={styles.gridTitle} numberOfLines={1}>Gập bụng đạp xe</Text>
              <Text style={styles.gridSub}>10 min • Beginner</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#111", marginBottom: 15 },
  bannerContainer: { height: 180, marginBottom: 24 },
  banner: { flex: 1, justifyContent: "center", padding: 20 },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)", borderRadius: 20 },
  bannerText: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 10, zIndex: 1 },
  bannerBtn: { flexDirection: "row", alignItems: "center", gap: 4, zIndex: 1 },
  bannerBtnText: { color: "#D4F93D", fontWeight: "700" },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#111", marginBottom: 15 },
  
  nutritionCard: {
    backgroundColor: "#F3F4F6", 
    borderRadius: 24,
    height: 160,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nutritionStats: {
    padding: 15,
    justifyContent: "center",
    gap: 8,
    width: "40%",
  },
  statItem: {
    backgroundColor: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  statValue: { fontSize: 14, fontWeight: "800", color: "#111" },
  statLabel: { fontSize: 10, color: "#6B7280", fontWeight: "600" },
  nutritionImage: {
    flex: 1,
    height: "100%",
    borderTopLeftRadius: 80, // Tạo đường cong cắt ảnh
    borderBottomLeftRadius: 20,
  },

  // Style cho Grid bài tập
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  gridItem: { width: "47%", marginBottom: 16 },
  gridImage: { width: "100%", height: 110, borderRadius: 16, marginBottom: 8, backgroundColor: "#eee" },
  gridTitle: { fontWeight: "700", fontSize: 14, color: "#111" },
  gridSub: { fontSize: 12, color: "#6B7280" },
});