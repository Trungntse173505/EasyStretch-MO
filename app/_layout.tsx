import { useAuthObserver } from "@/hooks/auth/useAuthObserver";
import { useNotifications } from "@/hooks/notification/useNotifications";
import { Stack } from "expo-router";
import { ActivityIndicator, Platform, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  // 2. Gọi hook thông báo để nó tự động xin quyền và lấy Push Token khi mở app
  const { expoPushToken } = useNotifications();

  // (Tùy chọn) In ra Terminal để bạn dễ copy Token đi test
  if (expoPushToken) {
    console.log("🔔 Token lấy được ở RootLayout:", expoPushToken);
  }

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