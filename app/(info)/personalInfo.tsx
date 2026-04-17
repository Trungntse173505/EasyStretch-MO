import authApi, { UserData } from "@/api/authApi";
import { useUpdateInfo } from "@/hooks/auth/useUpdateInfo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GOAL_OPTIONS = [
  { id: "energy", label: "Tăng năng lượng và tập trung" },
  { id: "weight", label: "Tăng cường độ dẻo dai" },
  { id: "health", label: "Cải thiện sức khỏe tổng thể" },
  { id: "posture", label: "Cải thiện tư thế ngồi" },
  { id: "pain", label: "Giảm đau lưng và vai gáy" },
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

  useEffect(() => { fetchUserData(); }, []);

  const handleSave = async () => {
    const success = await updateInfo(editForm);
    if (success) {
      setIsEditing(false);
      fetchUserData();
    }
  };

  if (loadingInitial) return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
      <ActivityIndicator size="large" color="#111" />
    </View>
  );

  const InfoRow = ({ icon, label, children }: any) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={styles.iconCircle}><Ionicons name={icon} size={20} color="#111" /></View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <TouchableOpacity
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          style={isEditing ? styles.iconBtnSave : styles.iconBtnEdit}
          disabled={updating}
        >
          {updating ? <ActivityIndicator size="small" color="#111" /> : <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color={isEditing ? "#111" : "#111"} />}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{user?.full_name?.charAt(0)?.toUpperCase() || "U"}</Text>
            </View>
            <Text style={styles.userName}>{user?.full_name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

          <View style={styles.card}>
            <InfoRow icon="person" label="Giới tính">
              {isEditing ? (
                <View style={styles.selectionRow}>
                  {['male', 'female'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.smallPill, editForm.gender === g && styles.pillActive]}
                      onPress={() => setEditForm({ ...editForm, gender: g })}
                    >
                      <Text style={[styles.pillText, editForm.gender === g && styles.pillTextActive]}>{g === 'male' ? 'Nam' : 'Nữ'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.infoValue}>{user?.gender === 'female' ? "Nữ" : "Nam"}</Text>
              )}
            </InfoRow>
            <View style={styles.divider} />
            <InfoRow icon="resize" label="Chiều cao">
              {isEditing ? (
                <View style={styles.inputWrap}>
                  <TextInput style={styles.input} value={editForm.height_cm} onChangeText={(v) => setEditForm({ ...editForm, height_cm: v })} keyboardType="numeric" />
                  <Text style={styles.unitText}>cm</Text>
                </View>
              ) : (
                <Text style={styles.infoValue}>{user?.height_cm} <Text style={{ fontSize: 12, color: '#94A3B8' }}>cm</Text></Text>
              )}
            </InfoRow>
            <View style={styles.divider} />
            <InfoRow icon="barbell" label="Cân nặng">
              {isEditing ? (
                <View style={styles.inputWrap}>
                  <TextInput style={styles.input} value={editForm.weight_kg} onChangeText={(v) => setEditForm({ ...editForm, weight_kg: v })} keyboardType="numeric" />
                  <Text style={styles.unitText}>kg</Text>
                </View>
              ) : (
                <Text style={styles.infoValue}>{user?.weight_kg} <Text style={{ fontSize: 12, color: '#94A3B8' }}>kg</Text></Text>
              )}
            </InfoRow>
          </View>

          <Text style={styles.sectionTitle}>Mục tiêu luyện tập</Text>
          <View style={styles.card}>
            {isEditing ? (
              <View style={styles.goalList}>
                {GOAL_OPTIONS.map((goal) => {
                  const isActive = editForm.goal === goal.label;
                  return (
                    <TouchableOpacity
                      key={goal.id}
                      style={[styles.goalItem, isActive && styles.goalItemActive]}
                      onPress={() => setEditForm({ ...editForm, goal: goal.label })}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.radio, isActive && styles.radioActive]}>
                        {isActive && <View style={styles.radioInner} />}
                      </View>
                      <Text style={[styles.goalText, isActive && styles.goalTextActive]}>{goal.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.goalReadView}>
                <Ionicons name="flag" size={24} color="#D4F93D" />
                <Text style={styles.goalDisplayText}>{user?.goal || "Chưa thiết lập mục tiêu"}</Text>
              </View>
            )}
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setIsEditing(false); fetchUserData(); }}>
              <Text style={styles.cancelBtnText}>Bỏ qua thay đổi</Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  iconBtnEdit: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  iconBtnSave: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#D4F93D', justifyContent: 'center', alignItems: 'center', shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#111" },

  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },

  profileSection: { alignItems: 'center', marginBottom: 30 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#111', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 },
  avatarText: { color: '#D4F93D', fontSize: 36, fontWeight: '900' },
  userName: { fontSize: 24, fontWeight: '900', color: '#111', letterSpacing: -0.5 },
  userEmail: { fontSize: 14, fontWeight: '600', color: '#64748B', marginTop: 4 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginTop: 24, marginBottom: 16, marginLeft: 4 },

  card: { backgroundColor: "#FFF", borderRadius: 24, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, minHeight: 70 },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 15, fontWeight: '700', color: '#475569' },
  infoValue: { fontSize: 16, fontWeight: '900', color: '#111' },

  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', flex: 0.5 },
  input: { fontSize: 16, fontWeight: '800', color: '#111', textAlign: 'right', flex: 1, padding: 0 },
  unitText: { marginLeft: 6, fontSize: 13, fontWeight: '700', color: '#94A3B8' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 74 },

  selectionRow: { flexDirection: 'row', gap: 8 },
  smallPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  pillActive: { backgroundColor: '#111', borderColor: '#111' },
  pillText: { fontSize: 13, fontWeight: '800', color: '#64748B' },
  pillTextActive: { color: '#FFF' },

  goalList: { padding: 12, gap: 8 },
  goalItem: { padding: 16, borderRadius: 16, backgroundColor: '#F8FAFC', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  goalItemActive: { backgroundColor: '#111', borderColor: '#111' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', marginRight: 14, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: '#D4F93D' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D4F93D' },
  goalText: { fontSize: 15, fontWeight: '700', color: '#475569', flex: 1 },
  goalTextActive: { color: '#FFF' },

  goalReadView: { padding: 24, flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 24, margin: 4 },
  goalDisplayText: { fontSize: 15, fontWeight: '800', color: '#FFF', flex: 1, marginLeft: 16, lineHeight: 22 },

  cancelBtn: { marginTop: 24, padding: 16, alignItems: 'center', backgroundColor: '#FEF2F2', borderRadius: 20 },
  cancelBtnText: { color: '#EF4444', fontWeight: '800', fontSize: 15 },
  errorText: { color: "#EF4444", textAlign: "center", marginBottom: 15, fontWeight: "700" }
});