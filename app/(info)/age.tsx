import React, { useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppScreen from "../components/AppScreen";

const ITEM_HEIGHT = 56;

export default function AgeScreen() {
  const router = useRouter();
  const ages = useMemo(() => Array.from({ length: 60 - 14 }, (_, i) => i + 15), []);
  const [selected, setSelected] = useState(19);

  const listRef = useRef<FlatList<number>>(null);

  const initialIndex = Math.max(0, ages.indexOf(selected));

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ITEM_HEIGHT);
    const v = ages[Math.min(Math.max(idx, 0), ages.length - 1)];
    setSelected(v);
  };

  return (
    <AppScreen style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </TouchableOpacity>

        <View style={styles.stepPill}>
          <Text style={styles.stepText}>1 of 4</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.question}>Bạn bao nhiêu tuổi?</Text>

        <View style={styles.pickerWrap}>
          <View style={styles.centerBox}>
            <Text style={styles.centerText}>{selected}</Text>
          </View>

          <FlatList
            ref={listRef}
            data={ages}
            keyExtractor={(i) => String(i)}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingVertical: ITEM_HEIGHT * 2,
            }}
            onMomentumScrollEnd={onEnd}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            initialScrollIndex={initialIndex}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={[styles.itemText, item === selected && { opacity: 0 }]}>
                  {item}
                </Text>
              </View>
            )}
          />
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/weight")}
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

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  question: { fontSize: 18, fontWeight: "900", color: "#111", marginTop: 8 },

  pickerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  centerBox: {
    position: "absolute",
    width: 74,
    height: 74,
    borderRadius: 16,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  centerText: { color: "#fff", fontSize: 34, fontWeight: "900" },

  item: { height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" },
  itemText: { fontSize: 22, fontWeight: "800", color: "#9CA3AF" },

  bottom: { paddingHorizontal: 16, paddingBottom: 16 },
  primaryBtn: {
    height: 50, backgroundColor: "#111", borderRadius: 14,
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10,
  },
  primaryText: { color: "#fff", fontWeight: "900" },
});
