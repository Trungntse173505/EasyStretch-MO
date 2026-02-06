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
            editable={!loading}
            secure
            error={passError}
            showError={touchedPassword}
          />

          {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

          <TouchableOpacity
            style={[styles.primaryBtn, (!canSubmit || loading) && { opacity: 0.6 }]}
            disabled={!canSubmit || loading}
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

          <View style={styles.bottomRow}>
            <Text style={styles.muted}>Chưa có tài khoản? </Text>
            <TouchableOpacity disabled={loading} onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.link}>Đăng ký</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity disabled={loading} onPress={() => router.push("/(auth)/otp")}>
            <Text style={[styles.link, { textAlign: "center" }]}>Quên Mật Khẩu</Text>
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
});
