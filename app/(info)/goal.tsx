import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppScreen from "../components/AppScreen";

const OPTIONS = [
  { id: "energy", label: "Tôi muốn tăng năng lượng và\ntập trung hơn", icon: "flash" as const },
  { id: "weight", label: "Tôi muốn tăng độ dẻo dai", icon: "barbell" as const },
  { id: "health", label: "Tôi muốn cải thiện sức khỏe", icon: "heart" as const },
  { id: "posture", label: "Tôi muốn cải thiện tư thế ngồi", icon: "body" as const },
  { id: "pain", label: "Tôi muốn giảm đau lưng và vai\ngáy", icon: "medkit" as const },
];

export default function GoalScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState("weight");

  return (
    <AppScreen style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </TouchableOpacity>

        <View style={styles.stepPill}>
          <Text style={styles.stepText}>4 of 4</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.question}>Mục tiêu rèn luyện thể{"\n"}chất của bạn là gì?</Text>

        <View style={styles.list}>
          {OPTIONS.map((o) => {
            const active = selected === o.id;
            return (
              <TouchableOpacity
                key={o.id}
                style={[styles.item, active && styles.itemActive]}
                activeOpacity={0.85}
                onPress={() => setSelected(o.id)}
              >
                <View style={styles.itemLeft}>
                  <View style={[styles.iconBox, active && styles.iconBoxActive]}>
                    <Ionicons name={o.icon} size={16} color={active ? "#fff" : "#111"} />
                  </View>
                  <Text style={[styles.itemText, active && styles.itemTextActive]}>{o.label}</Text>
                </View>

                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => {
            // Sau bước 4: đi vào app chính (tabs)
            // Nếu bạn có app/(tabs)/index.tsx thì dùng replace("/(tabs)")
            router.replace("/(tabs)");
          }}
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
  question: { fontSize: 18, fontWeight: "900", color: "#111" },

  list: { marginTop: 14, gap: 10 },

  item: {
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemActive: { backgroundColor: "#F97316" },

  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },

  iconBox: {
    width: 28, height: 28, borderRadius: 10,
    backgroundColor: "#E5E7EB",
    justifyContent: "center", alignItems: "center",
  },
  iconBoxActive: { backgroundColor: "rgba(0,0,0,0.25)" },

  itemText: { color: "#111", fontWeight: "900", lineHeight: 18, flex: 1 },
  itemTextActive: { color: "#fff" },

  radio: {
    width: 18, height: 18, borderRadius: 999,
    borderWidth: 2, borderColor: "rgba(0,0,0,0.25)",
    justifyContent: "center", alignItems: "center",
    marginLeft: 12,
  },
  radioActive: { borderColor: "#fff" },
  radioDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#fff" },

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
