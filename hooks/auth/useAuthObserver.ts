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
        const userStr = await AsyncStorage.getItem("USER_INFO");
        const user = userStr ? JSON.parse(userStr) : null;

        const inAuthGroup = segments[0] === "(auth)";
        if (!token) {
          if (!inAuthGroup) router.replace("/(auth)/login");
        } else {
          const hasProfile = !!(
            user?.height_cm || 
            user?.weight_kg || 
            user?.goal || 
            user?.gender
          );
          if (inAuthGroup) {
            router.replace(hasProfile ? "/(tabs)" : "/(auth)/onboarding");
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