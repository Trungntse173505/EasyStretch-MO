import { useAuthObserver } from "@/hooks/auth/useAuthObserver";
import { Stack } from "expo-router";
import { ActivityIndicator, Platform, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { isReady } = useAuthObserver();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent={false}
        backgroundColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
        barStyle="dark-content"
      />

      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}