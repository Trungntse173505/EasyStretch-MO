import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface VipProps { visible: boolean; onClose: () => void; }

export default function VipUpgradePopup({ visible, onClose }: VipProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setIsRendered(false));
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setIsRendered(false);
      onClose();
    });
  };

  const handleWebUpgrade = async () => {
    const websiteUrl = "https://www.easystretch.click";
    Alert.alert(
      "Nâng cấp Đặc Quyền VIP",
      `Để mở khóa toàn bộ tính năng cao cấp, vui lòng truy cập website:\n${websiteUrl}\nđể đăng ký tài khoản PRO.`,
      [
        { text: "Đóng", style: "cancel" },
        {
          text: "Sao chép Website",
          onPress: async () => {
            await Clipboard.setStringAsync(websiteUrl);
            Alert.alert("Thành công", "Đã sao chép địa chỉ website. Bạn hãy mở trình duyệt (Safari/Chrome) và dán vào nhé!");
            handleClose();
          }
        }
      ]
    );
  };

  if (!isRendered) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.overlay, { opacity: anim }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClose} />

        <Animated.View style={[styles.popup, { transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) }] }]}>

          <View style={styles.header}>
            <View style={styles.badge}><Ionicons name="diamond" size={16} color="#111" /><Text style={styles.badgeText}>PRO</Text></View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}><Ionicons name="close" size={20} color="#9CA3AF" /></TouchableOpacity>
          </View>

          <Text style={styles.title}>Nâng cấp Đặc Quyền</Text>
          <Text style={styles.sub}>Mở khóa 100% tính năng cao cấp không giới hạn.</Text>

          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>Gói 1 Tháng</Text>
              <Text style={styles.priceSub}>Chỉ hỗ trợ trên Website</Text>
            </View>
            <Text style={styles.priceAmount}>99k<Text style={{ fontSize: 14, color: '#9CA3AF' }}>/tháng</Text></Text>
          </View>

          <View style={styles.benefits}>
            {['Giáo án thiết kế chuyên sâu', 'Tương tác Chuyên gia AI', 'Mở khóa quản lý dinh dưỡng'].map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color="#111" />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleWebUpgrade} activeOpacity={0.85}>
            <Text style={styles.btnText}>Nâng cấp qua Website</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  popup: { backgroundColor: "#FFF", borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: "#D4F93D", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 6 },
  badgeText: { fontSize: 13, fontWeight: "900", color: "#111", letterSpacing: 1 },
  closeBtn: { width: 40, height: 40, backgroundColor: "#F1F5F9", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "900", color: "#111", marginBottom: 8, letterSpacing: -0.5 },
  sub: { fontSize: 15, color: "#64748B", marginBottom: 28, fontWeight: "600", lineHeight: 22 },

  priceCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FAFAFA", borderWidth: 2, borderColor: "#111", borderRadius: 24, padding: 24, marginBottom: 30 },
  priceLabel: { fontSize: 18, fontWeight: "900", color: "#111" },
  priceSub: { fontSize: 13, color: "#64748B", marginTop: 4, fontWeight: "600" },
  priceAmount: { fontSize: 32, fontWeight: "900", color: "#111", letterSpacing: -1 },

  benefits: { marginBottom: 35, gap: 14 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitText: { fontSize: 15, color: '#475569', fontWeight: '700' },

  btn: { backgroundColor: "#D4F93D", borderRadius: 30, paddingVertical: 18, alignItems: "center", shadowColor: '#D4F93D', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  btnText: { color: "#111", fontSize: 17, fontWeight: "900" },
});