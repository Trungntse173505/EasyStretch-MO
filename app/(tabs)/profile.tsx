import { useLogout } from "@/hooks/auth/useLogout";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useLogout(); 
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userStr = await AsyncStorage.getItem("USER_INFO");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (e) {
        console.error("Không thể tải thông tin user", e);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const MenuItem = ({ icon, label, isSwitch = false, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={isSwitch}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color="#111" />
        <Text style={styles.menuText}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch 
          trackColor={{ false: "#767577", true: "#D4F93D" }} 
          thumbColor={"#fff"} 
          value={false} 
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
        <View>
          <Text style={styles.headerTitle}>Cài đặt tài khoản</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" style={{ marginTop: 8, alignSelf: 'flex-start' }} />
          ) : (
            <Text style={styles.userSubText}>
              Chào, {user?.full_name || user?.user_name || "Người dùng"}!
            </Text>
          )}
        </View>
        
        {/* NÚT LOGOUT ✅ */}
        <TouchableOpacity onPress={logout} style={styles.logoutIcon}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionHeader}>Tổng quan</Text>
        <View style={styles.card}>
          <MenuItem icon="notifications-outline" label="Thông báo" />
          <View style={styles.divider} />
          <MenuItem 
            icon="person-outline" 
            label="Thông tin cá nhân" 
            onPress={() => router.push("/(auth)/onboarding")} 
          />
        </View>
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Security & Privacy</Text>
        <View style={styles.card}>
          <MenuItem icon="lock-closed-outline" label="Lấy Lại Mật Khẩu"/>
          <View style={styles.divider} />
        </View>
      </View>
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
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#fff" },
  userSubText: { fontSize: 14, color: "#D4F93D", marginTop: 4, fontWeight: "500" },
  logoutIcon: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  body: { padding: 20},
  sectionHeader: { fontSize: 26, fontWeight: "800", color: "#111", marginBottom: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 4, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4 },
  menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuText: { fontSize: 14, fontWeight: "600", color: "#111" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginLeft: 48 },
});