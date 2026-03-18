import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOTP } from "@/hooks/auth/useOTP";
import AuthInput from "../components/AuthInput";

export default function Otp() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { getOTP, resetPassword, loading, apiError, setApiError } = useOTP();

  const handleGetOTP = async () => {
    if (!email) {
      setApiError("Vui lòng nhập email");
      return;
    }
    const res = await getOTP(email);
    if (res.success) {
      setStep(2);
      setApiError("");
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      setApiError("Vui lòng điền đủ thông tin");
      return;
    }
    const res = await resetPassword(otp, email, newPassword);
    if (res.success) {
      Alert.alert("Thành công", "Đặt lại mật khẩu thành công!", [
        { text: "Đăng nhập", onPress: () => router.replace("/(auth)/login") }
      ]);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/ForgotPass.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.dim} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.modal}>
          {step === 1 ? (
            <>
              <View style={styles.checkCircle}>
                <Ionicons name="mail" size={18} color="#4CAF50" />
              </View>

              <Text style={styles.modalTitle}>Quên Mật Khẩu</Text>
              <Text style={styles.modalDesc}>
                Vui lòng nhập email của bạn để nhận mã OTP khôi phục.
              </Text>

              <View style={{ width: "100%", marginTop: 20 }}>
                <AuthInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  leftIcon="mail-outline"
                  placeholder="Nhập email của bạn"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

              <TouchableOpacity
                style={[styles.primaryBtn, (!email || loading) && { opacity: 0.6 }]}
                disabled={!email || loading}
                activeOpacity={0.85}
                onPress={handleGetOTP}
              >
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text style={styles.primaryBtnText}>Lấy mã OTP</Text>
                    <Ionicons name="send" size={16} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={18} color="#4CAF50" />
              </View>

              <Text style={styles.modalTitle}>Đã gửi OTP!</Text>
              <Text style={styles.modalDesc}>
                Chúng tôi đã gửi OTP đến{"\n"}
                <Text style={{ fontWeight: "800" }}>{email}</Text>. Vui lòng kiểm tra email.
              </Text>

              <View style={{ width: "100%", marginTop: 20 }}>
                <AuthInput
                  label="Mã OTP"
                  value={otp}
                  onChangeText={setOtp}
                  leftIcon="key-outline"
                  placeholder="Nhập mã OTP"
                  keyboardType="numeric"
                  editable={!loading}
                />
                <AuthInput
                  label="Mật khẩu mới"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  leftIcon="lock-closed-outline"
                  placeholder="Nhập mật khẩu mới"
                  secure
                  editable={!loading}
                />
              </View>

              {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

              <TouchableOpacity
                style={[styles.primaryBtn, (!otp || !newPassword || loading) && { opacity: 0.6 }]}
                disabled={!otp || !newPassword || loading}
                activeOpacity={0.85}
                onPress={handleResetPassword}
              >
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text style={styles.primaryBtnText}>Đặt Lại Mật Khẩu</Text>
                    <Ionicons name="lock-closed" size={16} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Ionicons name="close" size={18} color="#111" />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  safe: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },

  modal: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },

  checkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EAF7EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  modalTitle: { fontSize: 25, fontWeight: "900", color: "#111" },
  modalDesc: {
    textAlign: "center",
    marginTop: 8,
    color: "#6b7280",
    lineHeight: 18,
    fontSize: 15,
  },

  apiError: { color: "#ff3b30", marginTop: 10, marginBottom: 10, textAlign: "center" },

  primaryBtn: {
    width: "100%",
    height: 50,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "900" },

  closeBtn: {
    marginTop: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
