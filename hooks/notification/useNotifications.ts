import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from "react";

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');

  useEffect(() => {
    const setupFirebasemessage = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          
      if (enabled) {
        console.log("Có quyền thông báo");
        try {
          const token = await messaging().getToken();
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