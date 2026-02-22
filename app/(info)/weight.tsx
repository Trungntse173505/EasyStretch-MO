import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useOnboarding } from "../../context/OnboardingContext";
import AppScreen from "../components/AppScreen";

export default function WeightScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [weight, setWeight] = useState(62);

  const handleNext = () => {
    updateData({ weight: weight });
    router.push("/gender");
  };

  return (
    <AppScreen style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </TouchableOpacity>
        <View style={styles.stepPill}>
          <Text style={styles.stepText}>2 of 4</Text>
        </View>
      </View>

      <View style={styles.orange}>
        <Text style={styles.question}>Cân nặng hiện tại của{"\n"}bạn là bao nhiêu?</Text>
        <Text style={styles.big}>{weight} Kg</Text>

        <View style={styles.ticks}>
          {Array.from({ length: 31 }).map((_, i) => (
            <View key={i} style={[styles.tick, i % 5 === 0 ? styles.tickBig : styles.tickSmall]} />
          ))}
        </View>

        <View style={styles.sliderWrap}>
          <Slider
            minimumValue={30}
            maximumValue={120}
            step={1}
            value={weight}
            onValueChange={setWeight}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="rgba(255,255,255,0.35)"
            thumbTintColor="#fff"
          />
          <View style={styles.rangeRow}>
            <Text style={styles.rangeText}>30</Text>
            <Text style={styles.rangeText}>120</Text>
          </View>
        </View>

        <View style={styles.bottomWhite}>
          <TouchableOpacity style={styles.cta} onPress={handleNext}>
            <Text style={styles.ctaText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F97316" },
  header: { paddingHorizontal: 16, paddingTop: 8, flexDirection: "row", alignItems: "center" },
  backBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.75)", justifyContent: "center", alignItems: "center" },
  stepPill: { marginLeft: "auto", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.75)" },
  stepText: { fontSize: 14, fontWeight: "800", color: "#111" },
  orange: { flex: 1, backgroundColor: "#F97316" },
  question: { marginTop: 26, textAlign: "center", color: "#fff", fontSize: 35, fontWeight: "900", lineHeight: 40 },
  big: { marginTop: 22, textAlign: "center", color: "#fff", fontSize: 34, fontWeight: "900" },
  ticks: { marginTop: 22, flexDirection: "row", alignSelf: "center", gap: 6, alignItems: "flex-end" },
  tick: { width: 2, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.85)" },
  tickSmall: { height: 10, opacity: 0.6 },
  tickBig: { height: 18, opacity: 0.95 },
  sliderWrap: { marginTop: 14, paddingHorizontal: 22 },
  rangeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  rangeText: { color: "rgba(255,255,255,0.85)", fontWeight: "800", fontSize: 12 },
  bottomWhite: { marginTop: "auto", padding: 18, borderTopLeftRadius: 22, borderTopRightRadius: 22},
  cta: { height: 60, borderRadius: 14, backgroundColor: "#000000", borderWidth: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  ctaText: { color: "#ffffff", fontWeight: "900", fontSize: 18 },
});