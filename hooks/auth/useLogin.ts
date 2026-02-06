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
        if (token) await AsyncStorage.setItem("ACCESS_TOKEN", token);
        router.replace("/(auth)/onboarding");
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
