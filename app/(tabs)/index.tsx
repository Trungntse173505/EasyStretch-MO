import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POPULAR_WORKOUTS = [
  { id: 1, title: "Phục hồi chấn thương đầu gối", time: "30 Video", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800" },
  { id: 2, title: "Phục hồi cho mẹ bầu sau sinh", time: "40 Video", image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800" },
];

const SCHEDULE_WORKOUTS = [
  { id: 1, title: "Giãn cơ Cổ và Vai", duration: "Giữ mỗi bên 30 giây", level: "Intermediate", progress: 45, image: "https://images.unsplash.com/photo-1544367563-121910aaace0?w=400" },
  { id: 2, title: "Giãn cơ Lưng Dưới", duration: "Giữ mỗi bên 1 phút", level: "Beginner", progress: 75, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400" },
  { id: 3, title: "Giãn cơ Ngực", duration: "20 lần x 3 hiệp", level: "Beginner", progress: 10, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400" },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
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

        {/* POPULAR */}
        <Text style={styles.sectionTitle}>Khóa Tập Luyện Phục Hồi</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {POPULAR_WORKOUTS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.popularCard} activeOpacity={0.9}>
              <ImageBackground source={{ uri: item.image }} style={styles.popularBg} imageStyle={{ borderRadius: 24 }}>
                <View style={styles.cardOverlay} />
                <View style={styles.playButton}>
                  <Ionicons name="play" size={16} color="#000" style={{ marginLeft: 2 }} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.cardTags}>
                    <View style={styles.tag}><Ionicons name="time" size={10} color="#111" /><Text style={styles.tagText}>{item.time}</Text></View>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SCHEDULE */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Bài Tập Giảm Đau Mỏi Vai Gáy</Text>
        <View style={styles.verticalList}>
          {SCHEDULE_WORKOUTS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.scheduleItem} activeOpacity={0.9}>
              <Image source={{ uri: item.image }} style={styles.scheduleImage} />
              <View style={styles.scheduleInfo}>
                <View style={styles.scheduleHeader}>
                  <Text style={styles.scheduleTitle}>{item.title}</Text>
                  <View style={styles.levelTag}><Text style={styles.levelText}>{item.level}</Text></View>
                </View>
                <Text style={styles.scheduleSub}>{item.duration}</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
                </View>
              </View>
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
  tagText: { fontSize: 10, fontWeight: "700", color: "#111" },
  verticalList: { gap: 16 },
  scheduleItem: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 20, padding: 12, borderWidth: 1, borderColor: "#F3F4F6", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  scheduleImage: { width: 80, height: 80, borderRadius: 16, backgroundColor: "#eee" },
  scheduleInfo: { flex: 1, marginLeft: 14, justifyContent: "center" },
  scheduleHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  scheduleTitle: { fontSize: 16, fontWeight: "800", color: "#111", flex: 1, marginRight: 4 },
  levelTag: { backgroundColor: "#111", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  levelText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  scheduleSub: { fontSize: 12, color: "#6B7280", marginBottom: 10 },
  progressBarBg: { height: 6, backgroundColor: "#F3F4F6", borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: "#D4F93D", borderRadius: 3 },
});