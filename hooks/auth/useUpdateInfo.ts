import authApi from "@/api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";

export const useUpdateInfo = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const updateInfo = async (form: any) => {
    if (loading) return;
    try {
      setApiError("");
      setLoading(true);

      const payload = {
        height_cm: Number(form.height_cm) || 0,
        weight_kg: Number(form.weight_kg) || 0,
        gender: String(form.gender).toLowerCase(),
        goal: String(form.goal).trim(),
      };

      const res = await authApi.updateInfo(payload);
      
      if (res.data?.success) {
        await AsyncStorage.setItem("USER_INFO", JSON.stringify(res.data.data));
        router.replace("/(tabs)"); 
      }
    } catch (e: any) {
      console.error("LỖI UPDATE:", e.response?.data || e.message);
      
      if (e.response?.status === 401) {
        setApiError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setApiError(e.response?.data?.message || "Cập nhật thất bại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { updateInfo, loading, apiError, setApiError };
};