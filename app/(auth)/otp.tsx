import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function OtpBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={(t) => onChange(t.replace(/[^0-9]/g, "").slice(0, 1))}
      keyboardType="number-pad"
      maxLength={1}
      style={styles.otpInput}
      placeholder=""
    />
  );
}

export default function Otp() {
  const router = useRouter();
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [d3, setD3] = useState("");
  const [d4, setD4] = useState("");

  const code = `${d1}${d2}${d3}${d4}`;
  const canSubmit = useMemo(() => code.length === 4, [code]);

  return (
    <ImageBackground
      source={require("../../assets/images/ForgotPass.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.dim} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.modal}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={18} color="#4CAF50" />
          </View>

          <Text style={styles.modalTitle}>Đã gửi OTP!</Text>
          <Text style={styles.modalDesc}>
            Chúng tôi đã gửi OTP đến{"\n"}
            <Text style={{ fontWeight: "800" }}>"elementary221b@gmail.com"</Text>. Nhập
            vào đường dẫn để xác nhận email.
          </Text>

          <View style={styles.otpRow}>
            <OtpBox value={d1} onChange={setD1} />
            <OtpBox value={d2} onChange={setD2} />
            <OtpBox value={d3} onChange={setD3} />
            <OtpBox value={d4} onChange={setD4} />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]}
            disabled={!canSubmit}
            activeOpacity={0.85}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.primaryBtnText}>Gửi OTP</Text>
            <Ionicons name="lock-closed" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          activeOpacity={0.85}
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

  otpRow: { flexDirection: "row", gap: 10, marginTop: 14, marginBottom: 14 },
  otpInput: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  primaryBtn: {
    width: "100%",
    height: 50,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
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
