import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const router = useRouter();

  const handlePressNutrition = async () => {
    try {
      const hasSeen = await AsyncStorage.getItem("HAS_SEEN_NUTRITION_INTRO");
      if (hasSeen === "true") {
        router.push("/(nutrition)/log");
      } else {
        router.push("/(nutrition)");
      }
    } catch (error) {
      router.push("/(nutrition)");
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Hiệu ứng refresh trang tĩnh
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#111" />}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Khám Phá</Text>
          <TouchableOpacity style={styles.searchBtn} activeOpacity={0.8}>
            <Ionicons name="search" size={22} color="#111" />
          </TouchableOpacity>
        </View>

        {/* BANNER GỢI Ý */}
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop" }}
            style={styles.banner}
            imageStyle={{ borderRadius: 28 }}
          >
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerContent}>
              <View style={styles.badge}>
                <Ionicons name="star" size={12} color="#FFF" style={{marginRight: 4}} />
                <Text style={styles.badgeText}>Gợi ý cho bạn</Text>
              </View>
              <Text style={styles.bannerText}>Bài tập giãn cơ{"\n"}cho người mới</Text>
              <TouchableOpacity 
                style={styles.bannerBtn} 
                activeOpacity={0.85}
                onPress={() => router.push('/(stretching)')}
              >
                <Text style={styles.bannerBtnText}>Bắt đầu ngay</Text>
                <Ionicons name="arrow-forward" size={18} color="#111" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* ĐIỀU HƯỚNG DINH DƯỠNG */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Dinh Dưỡng</Text>
           <TouchableOpacity onPress={handlePressNutrition}>
              <Text style={styles.seeAllText}>Chi tiết</Text>
           </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.nutritionCard}
          onPress={handlePressNutrition}
          activeOpacity={0.9}
        >
          <View style={styles.nutriContent}>
            <View style={styles.nutriHeader}>
               <View style={styles.nutriIconBg}><Ionicons name="restaurant" size={22} color="#D4F93D" /></View>
               <Text style={styles.nutriTitle}>Thực Đơn & Calo</Text>
               <Ionicons name="arrow-forward-circle" size={32} color="#D4F93D" />
            </View>

            <Text style={styles.nutriDesc}>Theo dõi năng lượng nạp vào và kiểm soát chế độ ăn khoa học cùng Chuyên gia AI.</Text>

            <View style={styles.nutritionStats}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>Protein</Text>
                <View style={styles.statLineWrap}>
                   <View style={[styles.statLine, {width: '60%', backgroundColor: '#8B5CF6'}]} />
                </View>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>Carbs</Text>
                <View style={styles.statLineWrap}>
                   <View style={[styles.statLine, {width: '80%', backgroundColor: '#0EA5E9'}]} />
                </View>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>Fat</Text>
                <View style={styles.statLineWrap}>
                   <View style={[styles.statLine, {width: '40%', backgroundColor: '#F59E0B'}]} />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: "900", color: "#111", letterSpacing: -0.5 },
  searchBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },

  bannerContainer: { height: 240, marginBottom: 35, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 15, elevation: 8 },
  banner: { flex: 1, justifyContent: "flex-end" },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 28 },
  bannerContent: { padding: 24, zIndex: 1 },
  badge: { backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center' },
  badgeText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  bannerText: { color: "#fff", fontSize: 26, fontWeight: "900", marginBottom: 20, lineHeight: 34, letterSpacing: -0.5 },
  bannerBtn: { backgroundColor: "#D4F93D", alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 24, flexDirection: "row", alignItems: "center", gap: 8, shadowColor: '#D4F93D', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  bannerBtnText: { color: "#111", fontWeight: "900", fontSize: 15 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: "#111" },
  seeAllText: { color: '#8B5CF6', fontWeight: '800', fontSize: 14, marginBottom: 2 },

  nutritionCard: {
    backgroundColor: "#111",
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#111",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 20
  },
  nutriContent: { padding: 24 },
  nutriHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  nutriIconBg: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(212, 249, 61, 0.1)', justifyContent: 'center', alignItems: 'center' },
  nutriTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#FFF', marginLeft: 16 },
  nutriDesc: { color: '#9CA3AF', fontSize: 14, lineHeight: 22, fontWeight: '500', marginBottom: 24 },
  
  nutritionStats: { gap: 14 },
  statBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statValue: { width: 60, fontSize: 13, fontWeight: "700", color: "#F3F4F6" },
  statLineWrap: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  statLine: { height: '100%', borderRadius: 4 },
});