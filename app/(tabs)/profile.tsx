import authApi from "@/api/authApi";
import { useLogout } from "@/hooks/auth/useLogout";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VipUpgradePopup from "../VipUpgradePopup";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useLogout();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showVipPopup, setShowVipPopup] = useState(false);

  const isVip = user?.is_subscriber === "active";

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const res = await authApi.getInfo();
        if (res.data?.success) {
          setUser(res.data.data);
          await AsyncStorage.setItem("USER_INFO", JSON.stringify(res.data.data));
        }
      } catch (e) {
        const userStr = await AsyncStorage.getItem("USER_INFO");
        if (userStr) setUser(JSON.parse(userStr));
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const MenuItem = ({ icon, label, isSwitch = false, onPress, value = false }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={isSwitch} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <View style={styles.iconWrapper}><Ionicons name={icon} size={20} color="#111" /></View>
        <Text style={styles.menuText}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch trackColor={{ false: "#E2E8F0", true: "#D4F93D" }} thumbColor="#FFF" value={value} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Hồ sơ của bạn</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#D4F93D" style={{ marginTop: 8, alignSelf: 'flex-start' }} />
          ) : (
            <Text style={styles.userSubText}>👋 Chào, {user?.full_name || "Trải nghiệm Tốt nhé!"}</Text>
          )}
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutIcon} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* VIP CARD */}
        {isVip ? (
          <View style={styles.vipCardActive}>
            <View style={styles.vipIconWrapActive}><Ionicons name="diamond" size={24} color="#111" /></View>
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <Text style={styles.vipCardTitleActive}>Hội Viên Cao Cấp</Text>
              <Text style={styles.vipCardSubActive}>Toàn bộ quyền lợi đã mở khóa</Text>
            </View>
            <Ionicons name="checkmark-circle" size={28} color="#D4F93D" />
          </View>
        ) : (
          <TouchableOpacity style={styles.vipCard} onPress={() => setShowVipPopup(true)} activeOpacity={0.9}>
            <View style={styles.vipIconWrap}><Ionicons name="diamond" size={24} color="#FFF" /></View>
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <Text style={styles.vipCardTitle}>Nâng cấp PRO</Text>
              <Text style={styles.vipCardSub}>Khám phá 100% giáo án chuẩn hóa</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={32} color="#FFF" />
          </TouchableOpacity>
        )}

        <Text style={styles.sectionHeader}>Thông số cá nhân</Text>
        <View style={styles.card}>
          <MenuItem icon="person" label="Chỉnh sửa hồ sơ" onPress={() => router.push("/(info)/personalInfo")} />
          <View style={styles.divider} />
          <MenuItem icon="notifications" label="Thông báo hệ thống" isSwitch value={true} />
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Bảo mật & Cài đặt</Text>
        <View style={styles.card}>
          <MenuItem icon="lock-closed" label="Đổi mật khẩu bảo vệ" onPress={() => router.push("/(auth)/otp")} />
          <View style={styles.divider} />
          <MenuItem icon="shield-checkmark" label="Điều khoản & Chính sách" />
          <View style={styles.divider} />
        </View>
      </ScrollView>

      {!isVip && <VipUpgradePopup visible={showVipPopup} onClose={() => setShowVipPopup(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: { backgroundColor: "#111", paddingHorizontal: 24, paddingTop: 20, paddingBottom: 35, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 26, fontWeight: "900", color: "#FFF", letterSpacing: -0.5 },
  userSubText: { fontSize: 15, color: "#D4F93D", marginTop: 6, fontWeight: "700" },
  logoutIcon: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  body: { flex: 1, padding: 20 },

  vipCard: { backgroundColor: "#111", padding: 20, borderRadius: 28, flexDirection: "row", alignItems: "center", marginBottom: 30, shadowColor: "#111", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 8 },
  vipIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(212,249,61,0.2)', justifyContent: 'center', alignItems: 'center' },
  vipCardTitle: { fontSize: 18, fontWeight: "900", color: "#FFF", marginBottom: 2 },
  vipCardSub: { fontSize: 13, fontWeight: "600", color: "#9CA3AF" },

  vipCardActive: { backgroundColor: "#D4F93D", padding: 20, borderRadius: 28, flexDirection: "row", alignItems: "center", marginBottom: 30, shadowColor: "#D4F93D", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  vipIconWrapActive: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(17,17,17,0.1)', justifyContent: 'center', alignItems: 'center' },
  vipCardTitleActive: { fontSize: 18, fontWeight: "900", color: "#111", marginBottom: 2 },
  vipCardSubActive: { fontSize: 13, fontWeight: "700", color: "rgba(17,17,17,0.6)" },

  sectionHeader: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 14, marginLeft: 4 },
  card: { backgroundColor: "#FFF", borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18, paddingVertical: 20 },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconWrapper: { width: 42, height: 42, backgroundColor: '#F8FAFC', borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  menuText: { fontSize: 16, fontWeight: "700", color: "#111" },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginLeft: 74 },
});