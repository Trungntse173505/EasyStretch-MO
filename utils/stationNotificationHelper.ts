// utils/stationNotificationHelper.ts
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STATION_META } from '../app/(stretching)/data';

const SCHEDULED_FLAG_KEY = 'STATION_NOTIF_SCHEDULED_V2';
const USER_CUSTOM_TIMES_KEY = 'STATION_USER_CUSTOM_TIMES';

const getNotifId = (order: number) => `STRETCHING_STATION_${order}`;

export interface CustomNotifTime {
  order: number;
  hour: number;
  minute: number;
}

/**
 * Lấy danh sách giờ thông báo tùy chỉnh của user.
 * Nếu user chưa tùy chỉnh mốc nào, sẽ trả về giờ default từ STATION_META.
 */
export const getUserStationNotifTimes = async (): Promise<CustomNotifTime[]> => {
  try {
    const data = await AsyncStorage.getItem(USER_CUSTOM_TIMES_KEY);
    const customTimes: CustomNotifTime[] = data ? JSON.parse(data) : [];

    return STATION_META.map(station => {
      const custom = customTimes.find(c => c.order === station.order);
      if (custom) return custom;
      return { order: station.order, hour: station.notifHour, minute: station.notifMinute };
    });
  } catch {
    return STATION_META.map(s => ({ order: s.order, hour: s.notifHour, minute: s.notifMinute }));
  }
};

/**
 * Lưu danh sách giờ tùy chỉnh mới và re-schedule lại thông báo.
 */
export const saveUserStationNotifTimes = async (times: CustomNotifTime[]): Promise<void> => {
  await AsyncStorage.setItem(USER_CUSTOM_TIMES_KEY, JSON.stringify(times));
  await scheduleStationNotifications();
};

/**
 * Lên lịch thông báo DAILY cho 5 mốc, sử dụng giờ custom (nếu có).
 */
export const scheduleStationNotifications = async (): Promise<void> => {
  try {
    const masterEnabled = await AsyncStorage.getItem('MASTER_NOTI_ENABLED');
    if (masterEnabled === 'false') return;

    const notifTimes = await getUserStationNotifTimes();

    for (const station of STATION_META) {
      await Notifications.cancelScheduledNotificationAsync(getNotifId(station.order)).catch(() => {});

      const timeSetup = notifTimes.find(t => t.order === station.order);
      const hour = timeSetup ? timeSetup.hour : station.notifHour;
      const minute = timeSetup ? timeSetup.minute : station.notifMinute;

      await Notifications.scheduleNotificationAsync({
        identifier: getNotifId(station.order),
        content: {
          title: station.notifTitle,
          body: station.notifBody,
          sound: true,
          data: { type: 'station_reminder', order: station.order },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    }

    await AsyncStorage.setItem(SCHEDULED_FLAG_KEY, 'true');
    console.log('[Station Notif] ✅ Đã lên lịch với giờ custom:', notifTimes.map(i => `${i.hour}:${i.minute}`));
  } catch (e) {
    console.error('[Station Notif] Lỗi khi lên lịch:', e);
  }
};

export const cancelStationNotifications = async (): Promise<void> => {
  try {
    for (const station of STATION_META) {
      await Notifications.cancelScheduledNotificationAsync(getNotifId(station.order)).catch(() => {});
    }
    await AsyncStorage.removeItem(SCHEDULED_FLAG_KEY);
    console.log('[Station Notif] ❌ Đã huỷ tất cả thông báo mốc giãn cơ.');
  } catch (e) {
    console.error('[Station Notif] Lỗi khi huỷ:', e);
  }
};

export const isStationNotifScheduled = async (): Promise<boolean> => {
  const val = await AsyncStorage.getItem(SCHEDULED_FLAG_KEY);
  return val === 'true';
};
