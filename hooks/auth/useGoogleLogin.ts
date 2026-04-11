import authApi from "@/api/authApi";
import { supabase } from '@/utils/supabase';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useGoogleLogin = () => {
    const router = useRouter();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

        GoogleSignin.configure({
            webClientId: webClientId,
        });
    }, []);

    const loginWithGoogle = useCallback(async () => {
        if (isGoogleLoading) return;

        try {
            setApiError("");
            setIsGoogleLoading(true);
            await GoogleSignin.hasPlayServices();

            // THÊM ĐOẠN NÀY: Ép Google đăng xuất phiên cũ để luôn hiện bảng chọn tài khoản
            await GoogleSignin.signOut();

            // Bước 1: Gọi cửa sổ đăng nhập Google
            const userInfo = await GoogleSignin.signIn();

            // Bước 2: Lấy token Google
            const idToken = userInfo?.data?.idToken || userInfo?.idToken;

            if (!idToken) {
                console.log("Cấu trúc userInfo bị thiếu token:", JSON.stringify(userInfo, null, 2));
                throw new Error('Không lấy được token từ Google');
            }

            // Bước 3: Gửi token lên Supabase
            const { data: supabaseData, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: idToken,
            });

            if (error) throw error;

            // Lấy token từ Supabase
            const token = supabaseData.session?.access_token;

            if (token) {
                // 1. Lưu Token vào AsyncStorage
                await AsyncStorage.setItem("ACCESS_TOKEN", token);

                let userToSave = supabaseData.user;
                let hasProfile = false;

                // 2. Gọi api lấy thông tin User (Giống hệt bên useLogin)
                try {
                    const profileRes = await authApi.getInfo();
                    const backendUser = profileRes.data?.data;

                    if (backendUser) {
                        userToSave = backendUser;
                        hasProfile = !!(backendUser?.height_cm && backendUser?.weight_kg);
                    }
                } catch (e) {
                    console.log("Lưu ý: Không lấy được data từ authApi, sẽ dùng data của Supabase trả về.");
                    // Nếu BE chưa kịp xử lý user từ Google, ta check tạm trong metadata của Supabase
                    hasProfile = !!(userToSave?.user_metadata?.height_cm && userToSave?.user_metadata?.weight_kg);
                }

                // 3. Lưu User Info vào AsyncStorage
                await AsyncStorage.setItem("USER_INFO", JSON.stringify(userToSave));

                // 4. Điều hướng thông minh
                if (hasProfile) {
                    router.replace("/(tabs)");
                } else {
                    router.replace("/(auth)/onboarding");
                }

            } else {
                setApiError("Không nhận được token xác thực từ Supabase.");
            }

        } catch (error: any) {
            console.error('Lỗi đăng nhập Google chi tiết:', error);
            setApiError(error.message || 'Đăng nhập bằng Google thất bại.');
            // Tắt Alert đi nếu bạn muốn dùng dòng Text báo lỗi giống login thường, 
            // hoặc giữ lại Alert tùy ý thích của bạn.
            Alert.alert('Lỗi', 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
        } finally {
            setIsGoogleLoading(false);
        }
    }, [isGoogleLoading, router]);

    return { loginWithGoogle, isGoogleLoading, apiError, setApiError };
};