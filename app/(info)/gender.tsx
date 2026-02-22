import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useOnboarding } from "../../context/OnboardingContext";
import AppScreen from "../components/AppScreen";

export default function GenderScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [gender, setGender] = useState<"male" | "female" | null>("female");

  const handleNext = () => {
    if (!gender) return;
    updateData({ gender: gender });
    router.push("/goal");
  };

  const Card = ({ value, label, imageSource }: { value: "male" | "female"; label: string; imageSource: ImageSourcePropType }) => {
    const active = gender === value;
    return (
      <TouchableOpacity style={[styles.card, active && styles.cardActive]} activeOpacity={0.9} onPress={() => setGender(value)}>
        <ImageBackground source={imageSource} style={styles.cardBg} imageStyle={{ borderRadius: 14 }} resizeMode="cover">
          <View style={styles.cardOverlay} />
          <View style={styles.cardHeader}>
            <View style={styles.tagContainer}>
              <Ionicons name={value === "male" ? "male" : "female"} size={16} color="#111" />
              <Text style={styles.tagText}>{label}</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <View style={[styles.radioOuter, active ? styles.radioActive : styles.radioInactive]}>
              {active && <View style={styles.radioInner} />}
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#111" />
        </TouchableOpacity>
        <View style={styles.stepContainer}>
          <Text style={styles.stepText}>3 of 4</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Giới tính của bạn là gì?</Text>
        <Card value="male" label="Nam" imageSource={require("../../assets/images/man.png")} />
        <Card value="female" label="Nữ" imageSource={require("../../assets/images/woman.png")} />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.skipButton} onPress={() => router.push("/goal")}>
            <Text style={styles.skipText}>Tôi muốn bỏ qua, cảm ơn!</Text>
            <Ionicons name="close" size={16} color="#F97316" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
            <Text style={styles.continueText}>Tiếp tục</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  stepContainer: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#E8F0FE", borderRadius: 20 },
  stepText: { fontSize: 14, fontWeight: "700", color: "#2563EB" },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 24, textAlign: "center" },
  card: { height: 160, marginBottom: 16, borderRadius: 18, borderWidth: 2, borderColor: "transparent", backgroundColor: "#F9FAFB", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  cardActive: { borderColor: "#F97316" },
  cardBg: { flex: 1, padding: 12, justifyContent: "space-between" },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 14 },
  cardHeader: { alignItems: "flex-start" },
  tagContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.9)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  tagText: { fontSize: 14, fontWeight: "700", color: "#111" },
  cardFooter: { alignItems: "flex-start" },
  radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.5)" },
  radioInactive: { borderColor: "#9CA3AF" },
  radioActive: { borderColor: "#F97316", backgroundColor: "#fff" },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#F97316" },
  footer: { marginTop: "auto", paddingBottom: 20 },
  skipButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 14, backgroundColor: "#FFF7ED", borderRadius: 14, marginBottom: 12, gap: 8 },
  skipText: { fontSize: 14, fontWeight: "700", color: "#F97316" },
  continueButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", height: 56, backgroundColor: "#111", borderRadius: 14, gap: 10, shadowColor: "#F97316", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  continueText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});