import authApi, { UserData } from "@/api/authApi";
import { useUpdateInfo } from "@/hooks/auth/useUpdateInfo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GOAL_OPTIONS = [
  { id: "energy", label: "Tôi muốn tăng năng lượng và tập trung hơn" },
  { id: "weight", label: "Tôi muốn tăng độ dẻo dai" },
  { id: "health", label: "Tôi muốn cải thiện sức khỏe" },
  { id: "posture", label: "Tôi muốn cải thiện tư thế ngồi" },
  { id: "pain", label: "Tôi muốn giảm đau lưng và vai gáy" },
];

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const { updateInfo, loading: updating, apiError } = useUpdateInfo();

  const [editForm, setEditForm] = useState({
    height_cm: "",
    weight_kg: "",
    gender: "",
    goal: ""
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoadingInitial(true);
      const res = await authApi.getInfo();
      if (res.data?.success) {
        const data = res.data.data;
        setUser(data);
        setEditForm({
          height_cm: String(data.height_cm || ""),
          weight_kg: String(data.weight_kg || ""),
          gender: data.gender || "male",
          goal: data.goal || ""
        });
        await AsyncStorage.setItem("USER_INFO", JSON.stringify(data));
      }
    } catch (e) {
      const cached = await AsyncStorage.getItem("USER_INFO");
      if (cached) setUser(JSON.parse(cached));
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleSave = async () => {
    await updateInfo(editForm);
    if (!apiError) {
      setIsEditing(false);
      fetchUserData();
    }
  };

  if (loadingInitial) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#111" />;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        
        {isEditing ? (
          <TouchableOpacity onPress={handleSave} disabled={updating} style={styles.editBtn}>
            {updating ? <ActivityIndicator size="small" color="#2563EB" /> : <Text style={styles.saveBtnText}>Lưu</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
            <Text style={styles.editBtnText}>Sửa</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.full_name?.charAt(0) || "U"}</Text>
          </View>
          <Text style={styles.userName}>{user?.full_name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

        <View style={styles.card}>
          {/* GIỚI TÍNH */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={styles.iconCircle}><Ionicons name="person-outline" size={20} color="#111" /></View>
              <Text style={styles.infoLabel}>Giới tính</Text>
            </View>
            {isEditing ? (
              <View style={styles.selectionRow}>
                {['male', 'female'].map((g) => (
                  <TouchableOpacity 
                    key={g}
                    style={[styles.smallPill, editForm.gender === g && styles.pillActive]}
                    onPress={() => setEditForm({...editForm, gender: g})}
                  >
                    <Text style={[styles.pillText, editForm.gender === g && styles.pillTextActive]}>
                      {g === 'male' ? 'Nam' : 'Nữ'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.infoValue}>{user?.gender === 'female' ? "Nữ" : "Nam"}</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* CHIỀU CAO */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={styles.iconCircle}><Ionicons name="resize-outline" size={20} color="#111" /></View>
              <Text style={styles.infoLabel}>Chiều cao (cm)</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editForm.height_cm}
                onChangeText={(val) => setEditForm({ ...editForm, height_cm: val })}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{user?.height_cm}</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* CÂN NẶNG */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <View style={styles.iconCircle}><Ionicons name="speedometer-outline" size={20} color="#111" /></View>
              <Text style={styles.infoLabel}>Cân nặng (kg)</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editForm.weight_kg}
                onChangeText={(val) => setEditForm({ ...editForm, weight_kg: val })}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{user?.weight_kg}</Text>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Mục tiêu của bạn</Text>
        <View style={styles.card}>
          {isEditing ? (
            <View style={styles.goalList}>
              {GOAL_OPTIONS.map((goal) => (
                <TouchableOpacity 
                  key={goal.id} 
                  style={[styles.goalItem, editForm.goal === goal.label && styles.goalItemActive]}
                  onPress={() => setEditForm({...editForm, goal: goal.label})}
                >
                  <Text style={[styles.goalText, editForm.goal === goal.label && styles.goalTextActive]}>
                    {goal.label}
                  </Text>
                  {editForm.goal === goal.label && <Ionicons name="checkmark-circle" size={20} color="#fff" />}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.infoRow}>
               <Text style={styles.goalDisplayText}>{user?.goal || "Chưa thiết lập"}</Text>
            </View>
          )}
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => {
              setIsEditing(false);
              fetchUserData(); 
            }}
          >
            <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  editBtn: { padding: 8, minWidth: 60, alignItems: 'flex-end' },
  editBtnText: { color: "#E06400", fontWeight: "700" },
  saveBtnText: { color: "#2563EB", fontWeight: "700" },
  scrollContent: { padding: 20 },
  profileSection: { alignItems: 'center', marginBottom: 20 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  userName: { fontSize: 20, fontWeight: '800', color: '#111' },
  userEmail: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginTop: 20, marginBottom: 10, marginLeft: 4 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#111' },
  input: { fontSize: 14, fontWeight: '700', color: '#2563EB', textAlign: 'right', flex: 1, padding: 0 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 50 },
  selectionRow: { flexDirection: 'row', gap: 8 },
  smallPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6' },
  pillActive: { backgroundColor: '#111' },
  pillText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  pillTextActive: { color: '#fff' },
  goalList: { padding: 8, gap: 8 },
  goalItem: { padding: 12, borderRadius: 12, backgroundColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalItemActive: { backgroundColor: '#F97316' },
  goalText: { fontSize: 13, fontWeight: '700', color: '#4B5563', flex: 1 },
  goalTextActive: { color: '#fff' },
  goalDisplayText: { fontSize: 14, fontWeight: '700', color: '#111', paddingVertical: 4 },
  cancelBtn: { marginTop: 20, padding: 16, alignItems: 'center' },
  cancelBtnText: { color: '#EF4444', fontWeight: '700' },
  errorText: { color: "red", textAlign: "center", marginBottom: 10, fontWeight: "600" }
});