import { useRegister } from "@/hooks/auth/useRegister";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "@/utils/validatorsform";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthInput from "../components/AuthInput";

export default function Register() {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  const emailError = useMemo(() => validateEmail(email), [email]);
  const passError = useMemo(() => validatePassword(password), [password]);
  const confirmError = useMemo(
    () => validateConfirmPassword(password, confirm),
    [password, confirm]
  );

  const canSubmit =
    !emailError &&
    !passError &&
    !confirmError &&
    email.trim() &&
    password.trim() &&
    confirm.trim();

  const { register, loading, apiError } = useRegister();

  const handleRegister = () => {
    setTouchedEmail(true);
    setTouchedPassword(true);
    setTouchedConfirm(true);

    if (!canSubmit || loading) return;

    register({
      full_name: fullname,
      email,
      password,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={require("../../assets/images/LoginBackground.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Đăng ký</Text>
          <AuthInput
            label="Tên"
            value={fullname}
            onChangeText={setFullname}
            leftIcon="person-outline"
            placeholder="Nhập Họ và Tên"
            editable={!loading}
          />
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouchedEmail(true)}
            leftIcon="mail-outline"
            placeholder="Nhập email"
            keyboardType="email-address"
            editable={!loading}
            error={emailError}
            showError={touchedEmail}
          />
          <AuthInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            onBlur={() => setTouchedPassword(true)}
            leftIcon="lock-closed-outline"
            placeholder="Nhập mật khẩu"
            secure
            editable={!loading}
            error={passError}
            showError={touchedPassword}
          />
          <AuthInput
            label="Xác nhận mật khẩu"
            value={confirm}
            onChangeText={setConfirm}
            onBlur={() => setTouchedConfirm(true)}
            leftIcon="lock-closed-outline"
            placeholder="Nhập lại mật khẩu"
            secure
            editable={!loading}
            error={confirmError}
            showError={touchedConfirm}
          />
          {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}
          <TouchableOpacity
            style={[styles.primaryBtn, (!canSubmit || loading) && { opacity: 0.6 }]}
            disabled={!canSubmit || loading}
            activeOpacity={0.85}
            onPress={handleRegister}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? "Đang đăng ký..." : "Đăng Ký"}
            </Text>
          </TouchableOpacity>
          <View style={styles.bottomRow}>
            <Text style={styles.muted}>Đã có tài khoản? </Text>
            <TouchableOpacity disabled={loading} onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.link}>Đăng Nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  bg: { flex: 1 },

  container: { flex: 1, paddingHorizontal: 22, paddingTop: 205 },

  title: { marginTop: 16, fontSize: 24, fontWeight: "800", textAlign: "center" },

  apiError: { color: "#ff3b30", marginTop: 10, textAlign: "center" },

  primaryBtn: {
    marginTop: 10,
    height: 52,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },

  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  muted: { color: "#6b7280" },
  link: { color: "#E06400", fontWeight: "800" },
});
