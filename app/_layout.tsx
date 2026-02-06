import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, Platform } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* Để status bar không đè lên UI */}
      <StatusBar
        translucent={false}
        backgroundColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
        barStyle="dark-content"
      />

      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
