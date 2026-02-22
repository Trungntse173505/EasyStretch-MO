import authApi from "@/api/authApi";
import { useRouter } from "expo-router";
import { useState } from "react";

type UpdateInfoForm = {
  height_cm: number;
  weight_kg: number;
  gender: string;
  goal: string;
};
const mapUpdateError = (e: any) => {
  const raw =
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "";
  const s = String(raw).toLowerCase();
  if (s.includes("validation") || s.includes("invalid")) {
    return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại chiều cao và cân nặng.";
  }
  
  return "Cập nhật thông tin thất bại. Vui lòng thử lại sau.";
};

export const useUpdateInfo = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const updateInfo = async (form: UpdateInfoForm) => {
    if (loading) return;
    try {
      setApiError("");
      setLoading(true);
      await authApi.updateInfo({
        height_cm: Number(form.height_cm), 
        weight_kg: Number(form.weight_kg), 
        gender: form.gender,
        goal: form.goal,
      });
      router.replace("/(tabs)"); 
      
    } catch (e: any) {
      setApiError(mapUpdateError(e));
    } finally {
      setLoading(false);
    }
  };

  return { updateInfo, loading, apiError, setApiError };
};