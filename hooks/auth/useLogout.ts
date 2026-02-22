import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback } from "react";


export const useLogout = () => {
    const router = useRouter();
    const logout = useCallback(
        async () => {
            try {
                await AsyncStorage.multiRemove(["ACCESS_TOKEN", "USER_INFO"]);
                router.replace("/(auth)/login");
            } catch (e) {
                console.error("Lỗi khi đăng xuất:", e);
            }
        },[router]);
    return { logout };
}