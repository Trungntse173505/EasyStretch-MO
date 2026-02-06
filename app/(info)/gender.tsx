import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppScreen from "../components/AppScreen";

export default function GenderScreen() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female" | null>("female");

  const Card = ({
    value,
    label,
    icon,
  }: {
    value: "male" | "female";
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }) => {
    const active = gender === value;

    return (
      <TouchableOpacity
        style={[styles.card, active && styles.cardActive]}
        activeOpacity={0.85}
        onPress={() => setGender(value)}
      >
        <View style={styles.cardLeft}>
          <Ionicons name={value === "male" ? "male" : "female"} size={16} color="#111" />
          <Text style={styles.cardLabel}>{label}</Text>
        </View>

        {/* “ảnh” giả: khung gradient + icon */}
        <View style={[styles.poster, value === "male" ? styles.posterMale : styles.posterFemale]}>
        </View>

        <View style={[styles.radio, active && styles.radioActive]}>
          {active && <View style={styles.radioDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </TouchableOpacity>

        <View style={styles.stepPill}>
          <Text style={styles.stepText}>3 of 4</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.question}>Giới tính của bạn là gì?</Text>

        <Card value="male" label="Nam" icon="fitness" />
        <Card value="female" label="Nữ" icon="walk" />

        <TouchableOpacity
          style={styles.skip}
          activeOpacity={0.85}
          onPress={() => router.push("/goal")}
        >
          <Text style={styles.skipText}>Tôi muốn bỏ qua, cảm ơn!</Text>
          <Ionicons name="close" size={14} color="#F97316" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/goal")}
        >
          <Text style={styles.primaryText}>Tiếp tục</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: { paddingHorizontal: 16, paddingTop: 8, flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: "#F3F4F6",
    justifyContent: "center", alignItems: "center",
  },
  stepPill: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#E8F0FF",
  },
  stepText: { fontSize: 12, fontWeight: "800", color: "#2563EB" },

  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
  question: { fontSize: 18, fontWeight: "900", color: "#111", marginBottom: 12 },

  card: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  cardActive: { borderColor: "#F97316", backgroundColor: "#FFF7ED" },

  cardLeft: { flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 14, flex: 1 },
  cardLabel: { fontWeight: "900", color: "#111" },

  poster: {
    width: 110,
    height: 76,
    justifyContent: "center",
    alignItems: "center",
  },
  posterMale: { backgroundColor: "#111827" },
  posterFemale: { backgroundColor: "#7C3AED" },

  radio: {
    width: 18, height: 18, borderRadius: 999,
    borderWidth: 2, borderColor: "#D1D5DB",
    marginHorizontal: 12,
    justifyContent: "center", alignItems: "center",
  },
  radioActive: { borderColor: "#F97316" },
  radioDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#F97316" },

  skip: {
    marginTop: 14,
    alignSelf: "stretch",
    borderRadius: 12,
    backgroundColor: "#FFEAD5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  skipText: { color: "#F97316", fontWeight: "900", fontSize: 12 },

  primaryBtn: {
    marginTop: "auto",
    marginBottom: 16,
    height: 50,
    backgroundColor: "#111",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  primaryText: { color: "#fff", fontWeight: "900" },
});
