import { useGoogleLogin } from "@/hooks/auth/useGoogleLogin";
import { useLogin } from "@/hooks/auth/useLogin";
import { validateEmail, validatePassword } from "@/utils/validatorsform";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthInput from "../components/AuthInput";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const emailError = useMemo(() => validateEmail(email), [email]);
  const passError = useMemo(() => validatePassword(password), [password]);

  const canSubmit = !emailError && !passError && email.trim() && password.trim();

  const { login, loading, apiError } = useLogin();
  const { loginWithGoogle, isGoogleLoading } = useGoogleLogin();

  const handleLogin = () => {
    setTouchedEmail(true);
    setTouchedPassword(true);

    if (!canSubmit) return;
    login(email, password);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={require("../../assets/images/LoginBackground.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Đăng nhập</Text>
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouchedEmail(true)}
            leftIcon="mail-outline"
            placeholder="Nhập email"
            keyboardType="email-address"
            editable={!loading && !isGoogleLoading}
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
            editable={!loading && !isGoogleLoading}
            secure
            error={passError}
            showError={touchedPassword}
          />

          {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

          <TouchableOpacity
            style={[styles.primaryBtn, (!canSubmit || loading || isGoogleLoading) && { opacity: 0.6 }]}
            disabled={!canSubmit || loading || isGoogleLoading}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.primaryBtnText}>Đang đăng nhập...</Text>
              </View>
            ) : (
              <Text style={styles.primaryBtnText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          {/* Dòng chữ HOẶC */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Nút đăng nhập Google */}
          <TouchableOpacity
            style={[styles.googleBtn, (loading || isGoogleLoading) && { opacity: 0.6 }]}
            disabled={loading || isGoogleLoading}
            onPress={loginWithGoogle}
            activeOpacity={0.85}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color="#111" />
            ) : (
              <Text style={styles.googleBtnText}>Đăng nhập bằng Google</Text>
            )}
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <Text style={styles.muted}>Chưa có tài khoản? </Text>
            <TouchableOpacity disabled={loading || isGoogleLoading} onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.link}>Đăng ký</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity disabled={loading || isGoogleLoading} onPress={() => router.push("/(auth)/otp")}>
            <Text style={[styles.link, { textAlign: "center", marginTop: 20 }]}>Quên Mật Khẩu</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  bg: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 250 },

  title: { marginTop: 16, fontSize: 24, fontWeight: "800", textAlign: "center" },

  apiError: { color: "#ff3b30", marginTop: 10, textAlign: "center" },

  primaryBtn: {
    marginTop: 18,
    height: 52,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  muted: { color: "#6b7280" },
  link: { color: "#E06400", fontWeight: "800" },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 18
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb"
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#6b7280",
    fontWeight: "500"
  },
  googleBtn: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  googleBtnText: { color: "#111", fontWeight: "800" },
});