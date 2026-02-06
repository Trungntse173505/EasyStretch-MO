import authApi from "@/api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

export const useLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const login = useCallback(async (email: string, password: string) => {
    if (loading) return;
    try {
      setApiError("");
      setLoading(true);

      const res = await authApi.login({ email: email.trim(), password });
      const token = res?.data?.token;

      if (token) await AsyncStorage.setItem("ACCESS_TOKEN", token);
      router.replace("/(auth)/onboarding");
    } catch {
      setApiError("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }, [loading, router]);

  return { login, loading, apiError };
};
