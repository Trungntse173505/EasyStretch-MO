import authApi from "@/api/authApi";
import { useLogout } from "@/hooks/auth/useLogout";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useLogout(); 
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const res = await authApi.getInfo();
        if (res.data?.success) {
          const userData = res.data.data;
          setUser(userData);
          await AsyncStorage.setItem("USER_INFO", JSON.stringify(userData));
        }
      } catch (e) {
        console.error("Không thể tải thông tin user từ API, lấy từ cache...", e);
        const userStr = await AsyncStorage.getItem("USER_INFO");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const MenuItem = ({ icon, label, isSwitch = false, onPress, value = false }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={isSwitch}>
      <View style={styles.menuLeft}>
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={20} color="#111" />
        </View>
        <Text style={styles.menuText}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch 
          trackColor={{ false: "#E5E7EB", true: "#D4F93D" }} 
          thumbColor={"#fff"} 
          value={value} 
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Cài đặt tài khoản</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#D4F93D" style={{ marginTop: 8, alignSelf: 'flex-start' }} />
          ) : (
            <Text style={styles.userSubText}>
              Chào, {user?.full_name || "Người dùng"}!
            </Text>
          )}
        </View>
        
        <TouchableOpacity onPress={logout} style={styles.logoutIcon}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>Tổng quan</Text>
        <View style={styles.card}>
          <MenuItem icon="notifications-outline" label="Thông báo" isSwitch={true} value={true} />
          <View style={styles.divider} />
          <MenuItem 
            icon="person-outline" 
            label="Thông tin cá nhân" 
            onPress={() => router.push("/(info)/personalInfo")} 
          />
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Bảo mật & Quyền riêng tư</Text>
        <View style={styles.card}>
          <MenuItem icon="lock-closed-outline" label="Đổi mật khẩu" onPress={() => router.push("/(auth)/otp")} />
          <View style={styles.divider} />
          <MenuItem icon="shield-checkmark-outline" label="Điều khoản dịch vụ" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: { 
    backgroundColor: "#111", 
    padding: 24, 
    paddingBottom: 40, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#fff" },
  userSubText: { fontSize: 14, color: "#D4F93D", marginTop: 4, fontWeight: "600" },
  logoutIcon: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  body: { flex: 1, padding: 20 },
  sectionHeader: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 4, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 8 },
  menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrapper: { width: 36, height: 36, backgroundColor: '#F9FAFB', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuText: { fontSize: 15, fontWeight: "600", color: "#111" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginLeft: 64 },
  deleteAccount: { marginTop: 32, marginBottom: 40, alignItems: 'center' },
  deleteText: { color: "#EF4444", fontWeight: "700", fontSize: 14 }
});