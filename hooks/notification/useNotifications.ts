import { getMessaging, requestPermission, getToken, AuthorizationStatus } from '@react-native-firebase/messaging';
import { useEffect, useState } from "react";

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');

  useEffect(() => {
    const setupFirebasemessage = async () => {
      const messaging = getMessaging(); // Khởi tạo instance messaging
      
      const authStatus = await requestPermission(messaging);
      const enabled = 
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;
          
      if (enabled) {
        console.log("Có quyền thông báo");
        try {
          const token = await getToken(messaging);
          console.log('🚀 FCM Token thiết bị của bạn:', token);
          setExpoPushToken(token);
        } catch (error) {
          console.log("Lỗi khi lấy FCM Token:", error);
        }
      } else {
        console.log("Người dùng từ chối cấp quyền thông báo");
      }
    }
    
    setupFirebasemessage();
  }, []);

  return { expoPushToken };
}