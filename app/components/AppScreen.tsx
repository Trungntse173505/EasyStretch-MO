import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppScreen({
  children,
  style,
  noHorizontalPadding = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  noHorizontalPadding?: boolean;
}) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safe, style]} edges={["top", "bottom"]}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,         
            paddingBottom: insets.bottom,  
          },
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
});
