import authApi from "@/api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

export const useLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const login = useCallback(
    async (email: string, password: string) => {
      if (loading) return;

      try {
        setApiError("");
        setLoading(true);

        const loginRes = await authApi.login({ email: email.trim(), password });
        const token = loginRes.data?.token;

        if (token) {
          await AsyncStorage.setItem("ACCESS_TOKEN", token);
          const profileRes = await authApi.getInfo();
          const user = profileRes.data?.data;
          if (user) {
            await AsyncStorage.setItem("USER_INFO", JSON.stringify(user));
            const hasProfile = !!(user?.height_cm && user?.weight_kg);

            if (hasProfile) {
              router.replace("/(tabs)");
            } else {
              router.replace("/(auth)/onboarding");
            }
          }
        } else {
          setApiError("Không nhận được mã xác thực từ máy chủ.");
        }
      } catch (e: any) {
        console.error("LỖI LOGIN CHI TIẾT:", e.response?.data || e.message);
        setApiError(e.response?.data?.message || "Đăng nhập thất bại");
      } finally {
        setLoading(false);
      }
    },
    [loading, router]
  );

  return { login, loading, apiError, setApiError };
};