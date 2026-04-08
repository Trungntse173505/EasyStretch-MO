import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set handler cho thông báo (hiển thị kể cả khi app đang mở)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Tính toán và lên lịch gửi thông báo địa phương (Local Notification) dựa vào cài đặt nước
 * @param wakeTime Thời gian thức (VD: "08:00")
 * @param sleepTime Thời gian ngủ (VD: "22:00")
 * @param interval Khoảng cách giữa các lần nhắc, tính theo phút (VD: 60)
 */
export const scheduleWaterReminders = async (
  wakeTime: string,
  sleepTime: string,
  intervalParams: number
) => {
  try {
    // 0. Cầu dao tổng
    const isMasterEnabled = await AsyncStorage.getItem("MASTER_NOTI_ENABLED");
    if (isMasterEnabled === "false") {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return false;
    }

    // 1. Xin quyền thông báo
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Bạn cần cấp quyền nhận thông báo trong cài đặt để hệ thống nhắc nhở uống nước.');
      return false;
    }

    // 2. Xóa các thông báo đã lên lịch trước đó (Reset)
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 3. Tính toán các mốc thời gian
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    
    // Chuyển sang tổng số phút từ đầu ngày
    const startMins = wakeHour * 60 + wakeMin;
    let endMins = sleepHour * 60 + sleepMin;
    
    // Nếu giờ ngủ qua nửa đêm (VD: 01:00) so với giờ thức (08:00)
    if (endMins < startMins) {
      endMins += 24 * 60; // Thêm 24 tiếng
    }

    const messages = [
      "💧 Đến giờ uống nước rồi, nghỉ tay 1 phút nào!",
      "🧊 Cung cấp thêm năng lượng bằng một ngụm nước nhé!",
      "🌊 Cùng EasyStretch nạp đủ nước cho cơ thể khoẻ mạnh!",
      "🥤 Thêm một ly nước để có thêm động lực học tập / làm việc nha!"
    ];

    let currentMins = startMins;
    
    // 4. Lên lịch (Schedule) lặp lại hằng ngày
    while (currentMins <= endMins) {
      const hour = Math.floor((currentMins % (24 * 60)) / 60);
      const minute = currentMins % 60;
      
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Nhắc nhở uống nước 💧",
          body: randomMsg,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        } as any,
      });
      
      currentMins += intervalParams;
    }
    
    // console.log("Lên lịch nhắc uống nước thành công!");
    return true;
  } catch (error) {
    console.error("Lỗi khi thiết lập lịch nhắc nhở: ", error);
    return false;
  }
};
