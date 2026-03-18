import { useState } from "react";
import authApi from "../../api/authApi";

export const useOTP = () => {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const getOTP = async (gmail: string) => {
        setLoading(true);
        setApiError("");
        try {
            const res = await authApi.otp({ gmail });
            setLoading(false);
            return { success: true, data: res.data };
        } catch (error: any) {
            setLoading(false);
            const msg = error.response?.data?.message || "Gửi OTP thất bại";
            setApiError(msg);
            return { success: false, message: msg };
        }
    };

    const resetPassword = async (otp: string, gmail: string, password: string) => {
        setLoading(true);
        setApiError("");
        try {
            const res = await authApi.resetpass({ otp, gmail, password });
            setLoading(false);
            return { success: true, data: res.data };
        } catch (error: any) {
            setLoading(false);
            const msg = error.response?.data?.message || "Đặt lại mật khẩu thất bại";
            setApiError(msg);
            return { success: false, message: msg };
        }
    };

    return { getOTP, resetPassword, loading, apiError, setApiError };
}