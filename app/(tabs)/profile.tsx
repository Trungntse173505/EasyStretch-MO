import authApi from "@/api/authApi";
import { getWaterSettings } from "@/api/waterApi";
import { useLogout } from "@/hooks/auth/useLogout";
import { scheduleWaterReminders } from "@/utils/waterNotificationHelper";
import { scheduleStationNotifications } from "@/utils/stationNotificationHelper";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Alert, Modal, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from 'expo-notifications';
import { useOTP } from "@/hooks/auth/useOTP";
import AuthInput from "../components/AuthInput";
import VipUpgradePopup from "../VipUpgradePopup";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useLogout();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showVipPopup, setShowVipPopup] = useState(false);
  const [masterNotiEnabled, setMasterNotiEnabled] = useState(true);

  // States cho modal đổi mật khẩu
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const { getOTP, resetPassword, loading: otpLoading, apiError: otpError, setApiError: setOtpError } = useOTP();

  const isVip = user?.is_subscriber === "active";

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

  const loadMasterToggle = async () => {
    const val = await AsyncStorage.getItem("MASTER_NOTI_ENABLED");
    if (val === "false") setMasterNotiEnabled(false);
    else setMasterNotiEnabled(true);
  };

  useEffect(() => {
    loadUserData();
    loadMasterToggle();
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadUserData(), loadMasterToggle()]);
    setRefreshing(false);
  }, []);

  const toggleMasterNoti = async (value: boolean) => {
    setMasterNotiEnabled(value);
    await AsyncStorage.setItem("MASTER_NOTI_ENABLED", value ? "true" : "false");
    
    if (!value) {
      // SẬP CẦU DAO: Huỷ toàn bộ thông báo
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert("Đã tắt", "Đã ngắt toàn bộ thông báo hệ thống.");
    } else {
      // BẬT LẠI: Lấy cấu hình nước từ API để lên lịch lại
      if (user?.id) {
        try {
          // Báo cho user chờ 1 tẹo để không bấm liên tục
          const res = await getWaterSettings(user.id);
          const wSet = res?.data;
          if (wSet && wSet.wake_time && wSet.sleep_time && wSet.reminder_interval_mins) {
             await scheduleWaterReminders(wSet.wake_time, wSet.sleep_time, wSet.reminder_interval_mins);
          }
          // Khôi phục thêm station notifications giãn cơ
          await scheduleStationNotifications();
          Alert.alert("Đã kích hoạt", "Hệ thống thông báo đã khôi phục hoạt động.");
        } catch(e) {
          console.log("Không thể fetch lại setting nước:", e);
        }
      }
    }
  };

  const handleChangePasswordClick = () => {
    if (!user?.email) {
      Alert.alert("Không khả dụng", "Tài khoản của bạn chưa có email để nhận mã OTP.");
      return;
    }
    Alert.alert(
      "Xác nhận đổi mật khẩu",
      `Mã OTP xác nhận sẽ được gửi về email:\n${user.email}\n\nBạn có muốn tiếp tục?`,
      [
        { text: "Bỏ qua", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: async () => {
            const res = await getOTP(user.email);
            if (res.success) {
              setShowPwdModal(true);
            } else {
              Alert.alert("Lỗi", "Không thể gửi OTP, thử lại sau!");
            }
          }
        }
      ]
    );
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPwd) {
      setOtpError("Vui lòng điền đủ thông tin.");
      return;
    }
    if (newPassword !== confirmPwd) {
      setOtpError("Mật khẩu xác nhận không khớp.");
      return;
    }
    const res = await resetPassword(otp, user.email, newPassword);
    if (res.success) {
      Alert.alert("Thành công", "Mật khẩu của bạn đã được thay đổi. Hãy sử dụng mật khẩu mới trong lần đăng nhập sau.");
      setShowPwdModal(false);
      setOtp("");
      setNewPassword("");
      setConfirmPwd("");
    }
  };

  const MenuItem = ({ icon, label, isSwitch = false, onPress, value = false, onToggle }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={isSwitch ? () => toggleMasterNoti(!value) : onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <View style={styles.iconWrapper}><Ionicons name={icon} size={20} color="#111" /></View>
        <Text style={styles.menuText}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch 
          trackColor={{ false: "#E2E8F0", true: "#D4F93D" }} 
          thumbColor="#FFF" 
          value={value} 
          onValueChange={(val) => toggleMasterNoti(val)}
        />
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

      <ScrollView 
        style={styles.body} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#111" />}
      >
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
          <MenuItem 
            icon="notifications" 
            label="Thông báo hệ thống" 
            isSwitch 
            value={masterNotiEnabled} 
            onPress={() => toggleMasterNoti(!masterNotiEnabled)} // Fallback in case they tap line instead of switch
          />
          {/* Sửa <Switch> không nhận event onPress từ container cha nếu đang focus */}
          {/* Cần update MenuItem cho chuẩn */}
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Bảo mật & Cài đặt</Text>
        <View style={styles.card}>
          <MenuItem icon="lock-closed" label="Đổi mật khẩu bảo vệ" onPress={handleChangePasswordClick} />
          <View style={styles.divider} />
          <MenuItem icon="shield-checkmark" label="Điều khoản & Chính sách" onPress={() => router.push("/(info)/terms")} />
          <View style={styles.divider} />
        </View>
      </ScrollView>

      {!isVip && <VipUpgradePopup visible={showVipPopup} onClose={() => setShowVipPopup(false)} />}

      {/* OTP Reset Password Modal */}
      <Modal visible={showPwdModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xác nhận OTP</Text>
              <TouchableOpacity onPress={() => setShowPwdModal(false)} activeOpacity={0.8}>
                <Ionicons name="close-circle" size={28} color="#E2E8F0" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>Mã 6 số đã được gửi đến {user?.email}</Text>
            
            <View style={{ marginTop: 12 }}>
              <AuthInput label="Mã OTP" value={otp} onChangeText={setOtp} leftIcon="key-outline" placeholder="Nhập mã bảo mật" keyboardType="numeric" editable={!otpLoading} />
              <AuthInput label="Mật khẩu mới" value={newPassword} onChangeText={setNewPassword} leftIcon="lock-closed-outline" placeholder="Tối thiểu 6 ký tự" secure editable={!otpLoading} />
              <AuthInput label="Xác nhận mật khẩu" value={confirmPwd} onChangeText={setConfirmPwd} leftIcon="checkmark-circle-outline" placeholder="Nhập lại mật khẩu mới" secure editable={!otpLoading} />
            </View>

            {!!otpError && <Text style={styles.apiError}>{otpError}</Text>}

            <TouchableOpacity style={[styles.modalSubmitBtn, otpLoading && { opacity: 0.6 }]} onPress={handleResetPassword} disabled={otpLoading} activeOpacity={0.85}>
              {otpLoading ? <ActivityIndicator color="#111" /> : <Text style={styles.modalSubmitText}>HOÀN TẤT ĐỔI MẬT KHẨU</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24, paddingBottom: 40, shadowColor: '#000', shadowOffset: { width:0, height:-10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#111', letterSpacing: -0.5 },
  modalDesc: { fontSize: 14, color: '#64748B', marginTop: 6, fontWeight: '500' },
  apiError: { color: '#EF4444', marginTop: 12, textAlign: 'center', fontSize: 14, fontWeight: '600' },
  modalSubmitBtn: { backgroundColor: '#D4F93D', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 24, shadowColor: '#D4F93D', shadowOffset: {width:0, height:8}, shadowOpacity: 0.3, shadowRadius: 15, elevation: 6 },
  modalSubmitText: { color: '#111', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
});