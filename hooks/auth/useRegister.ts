import authApi from "@/api/authApi";
import { useRouter } from "expo-router";
import { useState } from "react";

type RegisterForm = {
  user_name: string;
  full_name: string;
  email: string;
  password: string;
};

const mapRegisterError = (e: any) => {
  const raw =
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "";
  const s = String(raw).toLowerCase();
  // ✅ trùng email
  if (s.includes("users_email_key") || (s.includes("duplicate") && s.includes("email"))) {
    return "Email này đã được sử dụng. Vui lòng dùng email khác.";
  }
  // ✅ trùng username
  if (s.includes("users_user_name_key") || s.includes("users_username_key") || (s.includes("duplicate") && s.includes("user"))) {
    return "Username đã tồn tại. Vui lòng chọn username khác.";
  }
  return "Đăng ký thất bại. Vui lòng thử lại.";
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
        user_name: form.user_name.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim(), 
        password: form.password,
        role: "user",
      };

      await authApi.register(payload);

      router.replace("/(auth)/login");
    } catch (e: any) {
      setApiError(mapRegisterError(e));
      return;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, apiError, setApiError };
};
