import authApi, { UserData } from "@/api/authApi";
import { useCallback, useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await authApi.getInfo();
      if (response?.success) {
        setUser(response.data);
      }
    } catch (e: any) {
      console.log("Error getInfo:", e);
      setError(e?.response?.data?.message || "Không thể lấy thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, loading, error, refresh: fetchProfile };
};