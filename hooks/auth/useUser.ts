// hooks/useUser.ts
import authApi, { UserData } from "@/api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const cachedData = await AsyncStorage.getItem("USER_INFO");
      if (cachedData) {
        setUser(JSON.parse(cachedData));
        setLoading(false); 
      } else {
        setLoading(true); 
      }
      const response: any = await authApi.getInfo();
      const freshUser = response?.data?.data || response?.data;
      if (freshUser && freshUser.id) {
        setUser(freshUser);
        await AsyncStorage.setItem("USER_INFO", JSON.stringify(freshUser));
      }
      
    } catch (e: any) {
      console.log("Error getInfo:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, loading, refresh: fetchProfile };
};