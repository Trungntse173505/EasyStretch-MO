import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Onboarding() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/Onboarding_Screen.jpg")}
      resizeMode="cover"
      style={styles.container}          
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <Text style={styles.topHint}>Onboarding Screen</Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.title}>
            Thư Giãn &amp; Tái Tạo{"\n"}
            <Text style={styles.highlight}> Năng Lượng </Text>
            Ngay Tại Bàn Làm Việc
          </Text>

          <Text style={styles.desc}>
            Chăm chút đủ mỗi ngày, lắng và có chỉ{"\n"}với 5 phút mỗi ngày.
          </Text>

          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.85}
            onPress={() => router.replace("/age")}
          >
            <Text style={styles.btnText}>Bắt đầu ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, 
  safe: { flex: 1, backgroundColor: "transparent" },

  top: { flex: 2, position: "relative" },

  topHint: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontWeight: "700",
    fontSize: 12,
  },

  bottom: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 18,
    alignItems: "center",
    borderTopLeftRadius: 24,   
    borderTopRightRadius: 24, 
  },

  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
    lineHeight: 22,
  },
  highlight: { color: "#16A34A", fontWeight: "900" },

  desc: {
    marginTop: 25,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
  },

  dots: {
    marginTop: 12,
    marginBottom: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 6, height: 6, borderRadius: 999, backgroundColor: "#D1D5DB" },
  dotActive: {
    width: 22,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#111",
  },

  btn: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },
});
