import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import AppScreen from "../components/AppScreen";

export default function WeightScreen() {
  const router = useRouter();
  const [weight, setWeight] = useState(62);

  return (
    <AppScreen style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </TouchableOpacity>

        <View style={styles.stepPill}>
          <Text style={styles.stepText}>2 of 4</Text>
        </View>
      </View>

      <View style={styles.orange}>
        <Text style={styles.question}>Cân nặng hiện tại của{"\n"}bạn là bao nhiêu?</Text>

        <Text style={styles.big}>{weight} Kg</Text>

        {/* ticks */}
        <View style={styles.ticks}>
          {Array.from({ length: 31 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.tick,
                i % 5 === 0 ? styles.tickBig : styles.tickSmall,
              ]}
            />
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
            <Text style={styles.rangeText}>50</Text>
            <Text style={styles.rangeText}>80</Text>
          </View>
        </View>

        <View style={styles.bottomWhite}>
          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.85}
            onPress={() => router.push("/gender")}
          >
            <Text style={styles.ctaText}>Tiếp tục</Text>
            <Ionicons name="arrow-forward" size={16} color="#111" />
          </TouchableOpacity>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F97316" },

  header: { paddingHorizontal: 16, paddingTop: 8, flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.75)",
    justifyContent: "center", alignItems: "center",
  },
  stepPill: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  stepText: { fontSize: 12, fontWeight: "800", color: "#111" },

  orange: { flex: 1, backgroundColor: "#F97316" },

  question: {
    marginTop: 26,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
  },
  big: {
    marginTop: 22,
    textAlign: "center",
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
  },

  ticks: {
    marginTop: 22,
    flexDirection: "row",
    alignSelf: "center",
    gap: 6,
    alignItems: "flex-end",
  },
  tick: { width: 2, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.85)" },
  tickSmall: { height: 10, opacity: 0.6 },
  tickBig: { height: 18, opacity: 0.95 },

  sliderWrap: { marginTop: 14, paddingHorizontal: 22 },
  rangeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  rangeText: { color: "rgba(255,255,255,0.85)", fontWeight: "800", fontSize: 12 },

  bottomWhite: {
    marginTop: "auto",
    padding: 18,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  cta: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#000000",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  ctaText: { color: "#ffffff", fontWeight: "900" },
});
