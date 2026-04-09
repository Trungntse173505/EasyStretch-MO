import { useExercisesClient } from "@/hooks/exercise/useExercisesClient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseListScreen() {
  const router = useRouter();
  const { exercises, loading } = useExercisesClient();
  const [searchText, setSearchText] = useState("");

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    return m > 0 ? `${m} phút` : `${seconds} s`;
  };

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return exercises;
    return exercises.filter(item =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, exercises]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
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
          {item.target_muscle?.slice(0, 2).map((m: string, i: number) => (
            <View key={i} style={styles.tag}><Text style={styles.tagText}>{m}</Text></View>
          ))}
          {item.target_muscle?.length > 2 && (
             <View style={styles.tag}><Text style={styles.tagText}>+{item.target_muscle.length - 2}</Text></View>
          )}
        </View>
      </View>
      <Ionicons name="arrow-forward-circle" size={32} color="#D4F93D" style={{ marginLeft: 10 }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tất Cả Bài Tập</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm bài tập (Cổ, vai, lưng...)"
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
              <Ionicons name="fitness-outline" size={64} color="#E2E8F0" />
              <Text style={styles.emptyText}>Không tìm thấy bài tập nào</Text>
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
  exCard: { flexDirection: "row", alignItems: 'center', backgroundColor: "#FFF", borderRadius: 24, padding: 14, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
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

  centered: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, color: "#94A3B8", fontWeight: "600" },
});
