import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WheelPicker from "react-native-wheely";
import { useOnboarding } from "../../context/OnboardingContext"; 
import AppScreen from "../components/AppScreen";

const VISIBLE_REST = 2;
const ITEM_HEIGHT = 53;
const WHEEL_HEIGHT = ITEM_HEIGHT * (VISIBLE_REST * 2 + 1);

export default function AgeScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding(); 

  const ages = useMemo(
    () => Array.from({ length: 60 - 14 }, (_, i) => String(i + 15)),
    []
  );

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const idx = ages.indexOf("18");
    return idx >= 0 ? idx : 0;
  });

  const selectedAge = ages[selectedIndex];

  const handleNext = () => {
    updateData({ age: Number(selectedAge) });
    router.push("/weight");
  };

  return (
    <AppScreen style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </TouchableOpacity>
        <View style={styles.stepPill}>
          <Text style={styles.stepText}>1 of 4</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.content}>
        <Text style={styles.question}>Bạn bao nhiêu tuổi?</Text>
        <View style={styles.pickerWrap}>
          <View style={styles.wheelWrap}>
            <WheelPicker
              options={ages}
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
              itemHeight={ITEM_HEIGHT}
              visibleRest={VISIBLE_REST}
              containerStyle={styles.wheelContainer}
              selectedIndicatorStyle={styles.selectedIndicator}
              itemTextStyle={{ color: "#9CA3AF", fontSize: 26, fontWeight: "500" }}
            />
            <LinearGradient
              pointerEvents="none"
              colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
              style={[styles.fade, styles.fadeTop]}
            />
            <LinearGradient
              pointerEvents="none"
              colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
              style={[styles.fade, styles.fadeBottom]}
            />
            <View style={styles.centerBox} pointerEvents="none">
              <Text style={styles.centerText}>{selectedAge}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
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
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  stepPill: { marginLeft: "auto", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: "#E8F0FF" },
  stepText: { fontSize: 14, fontWeight: "800", color: "#2563EB" },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  question: { fontSize: 38, fontWeight: "900", color: "#111", marginTop: 10, lineHeight: 42 },
  pickerWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  wheelWrap: { width: 260, height: WHEEL_HEIGHT, justifyContent: "center", alignItems: "center" },
  wheelContainer: { width: 260, height: WHEEL_HEIGHT },
  selectedIndicator: { alignSelf: "center", borderRadius: 22, opacity: 0 },
  centerBox: { position: "absolute", width: 96, height: 73, borderRadius: 24, backgroundColor: "#F97316", justifyContent: "center", alignItems: "center", zIndex: 10, elevation: 6 },
  centerText: { color: "#fff", fontSize: 50, fontWeight: "900" },
  fade: { position: "absolute", zIndex: 9, height: 60, width: "100%" },
  fadeTop: { top: 0 },
  fadeBottom: { bottom: 0 },
  bottom: { paddingHorizontal: 16, paddingBottom: 16 },
  primaryBtn: { height: 60, backgroundColor: "#111", borderRadius: 18, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  primaryText: { color: "#fff", fontWeight: "900", fontSize: 18 },
});