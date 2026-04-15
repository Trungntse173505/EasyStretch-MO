import API_URL from '@/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
})

axiosClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('ACCESS_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Catch 401 gracefully — token hết hạn sẽ không crash app
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn: xóa token cũ (người dùng sẽ được điều hướng logout ở chỗ khác)
            AsyncStorage.removeItem('ACCESS_TOKEN').catch(() => {});
        }
        return Promise.reject(error);
    }
);

export default axiosClient;

