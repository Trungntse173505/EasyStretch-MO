import authApi from "@/api/authApi";
import { useRouter } from "expo-router";
import { useState } from "react";

type RegisterForm = {
  full_name: string;
  email: string;
  password: string;
};

export const useRegister = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const register = async (form: RegisterForm) => {
    if (loading) return;

    try {
      setApiError("");
      setLoading(true);
      const payload = {
        user_name: form.email.trim().split("@")[0], 
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: "user",
      };
      await authApi.register(payload);
      router.replace("/(auth)/login");
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Đăng ký thất bại";
      setApiError(message);
      return;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, apiError };
};
