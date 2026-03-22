// api/waterApi.ts
import axiosClient from './axiosClient';

export interface WaterSettingsRequest {
  user_id: string;
  daily_goal_ml: number;
  wake_time: string; 
  sleep_time: string; 
  reminder_interval_mins: number;
}

export interface LogWaterRequest {
  user_id: string;
  amount_ml: number;
}

// 1. Cập nhật mục tiêu nước & Sinh lịch nhắc nhở
export const updateWaterSettings = async (data: WaterSettingsRequest) => {
  const response = await axiosClient.post('/water/settings', data);
  return response.data;
};

// 2. Ghi nhận 1 lần uống nước
export const logWater = async (data: LogWaterRequest) => {
  const response = await axiosClient.post('/water/log', data);
  return response.data;
};

// 3. Lấy tiến độ uống nước hôm nay
export const getWaterProgress = async (userId: string) => {
  const response = await axiosClient.get(`/water/progress/${userId}`);
  return response.data;
};

// 4. Lấy toàn bộ lịch sử uống nước
export const getWaterLog = async (userId: string) => {
  const response = await axiosClient.get(`/water/log/${userId}`);
  return response.data;
};

// 5. Lấy lịch sử uống nước theo ngày cụ thể
export const getWaterLogByDay = async (userId: string, date: string) => {
  const response = await axiosClient.get(`/water/log/daily/${userId}`, {
    params: { date },
  });
  return response.data;
};