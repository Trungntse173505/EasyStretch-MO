import authApi from "@/api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export const useAuthObserver = () => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("ACCESS_TOKEN");
        const inAuthGroup = segments[0] === "(auth)";

        if (!token) {
          if (!inAuthGroup) router.replace("/(auth)/login");
        } else {
          try {
            const res = await authApi.getInfo();
            const user = res.data?.data;

            if (user) {
              await AsyncStorage.setItem("USER_INFO", JSON.stringify(user));
              const hasProfile = !!(user?.height_cm && user?.weight_kg);
              if (inAuthGroup) {
                router.replace(hasProfile ? "/(tabs)" : "/(auth)/onboarding");
              }
            }
          } catch (apiErr) {
            await AsyncStorage.removeItem("ACCESS_TOKEN");
            router.replace("/(auth)/login");
          }
        }
      } catch (e) {
        console.error("Auth Observer Error:", e);
      } finally {
        setIsReady(true);
      }
    };

    checkAuth();
  }, [segments, router]);

  return { isReady };
};