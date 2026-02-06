import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Welcome() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/Welcome.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Overlay để chữ/logo nổi hơn */}
      <View style={styles.overlay} />
      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.titleSmall}>Chào mừng đến với</Text>
        <Text style={styles.titleBig}>EASYSTRETCH</Text>

        {/* Button */}
        <TouchableOpacity
          style={styles.startBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/(auth)/login")}
        >
          <View style={styles.btnRow}>
            <Text style={styles.btnText}>Tiếp theo</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  titleSmall: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  titleBig: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 26,
  },

  startBtn: {
    width: "78%",
    backgroundColor: "#b85900",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
