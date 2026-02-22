import authApi from "@/api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

const mapLoginError = (e: any) => {
  const msg = e?.response?.data?.message;
  if (typeof msg === "string" && msg.trim()) return msg;
  const status = e?.response?.status;
  if (status === 401) return "Tài khoản không tồn tại";
  if (status === 400) return "Mật khẩu không chính xác";
  return "Đăng nhập thất bại";
};

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
        const res = await authApi.login({ email: email.trim(), password });
        const token = res?.data?.token;
        const user = res?.data?.data;
        console.log("FULL DATA:", res.data); 
        console.log("USER DATA:", user);      
        if (token) {
          await AsyncStorage.setItem("ACCESS_TOKEN", token);
          await AsyncStorage.setItem("USER_INFO", JSON.stringify(user));
        }
        const hasProfile = !!(
          user?.height_cm || 
          user?.weight_kg || 
          user?.goal || 
          user?.gender
        );
        router.replace(hasProfile ? "/(tabs)" : "/(auth)/onboarding");
      } catch (e: any) {
        setApiError(mapLoginError(e));
        return;
      } finally {
        setLoading(false);
      }
    },
    [loading, router]
  );
  return { login, loading, apiError, setApiError };
};
