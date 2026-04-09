// app/(stretching)/data.ts
// Metadata cố định cho 5 Mốc mỗi ngày — App tự quản lý, không có BE

export interface StationMeta {
  order: number;
  name: string;
  icon: string;
  notifHour: number;
  notifMinute: number;
  windowStartHour: number;
  windowStartMinute: number;
  windowEndHour: number;
  windowEndMinute: number;
  notifTitle: string;
  notifBody: string;
}

export const STATION_META: StationMeta[] = [
  {
    order: 1,
    name: 'Mốc 1 · Sáng',
    icon: '🌅',
    notifHour: 6, notifMinute: 30,
    windowStartHour: 6, windowStartMinute: 0,
    windowEndHour: 7, windowEndMinute: 30,
    notifTitle: '🌅 Mốc 1: Buổi sáng đây rồi!',
    notifBody: 'Khởi động ngày mới với bài giãn cơ buổi sáng, nhận +10 điểm nào!',
  },
  {
    order: 2,
    name: 'Mốc 2 · Giải lao sáng',
    icon: '☕',
    notifHour: 9, notifMinute: 30,
    windowStartHour: 9, windowStartMinute: 30,
    windowEndHour: 10, windowEndMinute: 0,
    notifTitle: '☕ Mốc 2: Giải lao đi!',
    notifBody: 'Nghỉ ngơi 5 phút, giãn cơ nhẹ rồi tiếp tục làm việc thôi!',
  },
  {
    order: 3,
    name: 'Mốc 3 · Nghỉ trưa',
    icon: '🍱',
    notifHour: 12, notifMinute: 0,
    windowStartHour: 12, windowStartMinute: 0,
    windowEndHour: 13, windowEndMinute: 0,
    notifTitle: '🍱 Mốc 3: Nghỉ trưa!',
    notifBody: 'Thư giãn cơ thể trong giờ nghỉ trưa để chiều làm việc hiệu quả hơn!',
  },
  {
    order: 4,
    name: 'Mốc 4 · Tan làm',
    icon: '🏁',
    notifHour: 16, notifMinute: 45,
    windowStartHour: 16, windowStartMinute: 30,
    windowEndHour: 17, windowEndMinute: 30,
    notifTitle: '🏁 Mốc 4: Sắp tan làm rồi!',
    notifBody: '"Xả hơi" cơ thể sau một ngày dài, +10 điểm đang chờ!',
  },
  {
    order: 5,
    name: 'Mốc 5 · Sắp ngủ',
    icon: '🌙',
    notifHour: 21, notifMinute: 0,
    windowStartHour: 21, windowStartMinute: 0,
    windowEndHour: 22, windowEndMinute: 0,
    notifTitle: '🌙 Mốc 5: Chuẩn bị ngủ nào!',
    notifBody: 'Thư giãn sâu để có giấc ngủ ngon, hoàn thành nhiệm vụ cuối ngày!',
  },
];

// Helper: Lấy metadata theo order
export const getStationByOrder = (order: number): StationMeta | undefined =>
  STATION_META.find(s => s.order === order);

// Helper: Kiểm tra giờ hiện tại có trong cửa sổ cho phép không
export const isStationUnlocked = (station: StationMeta, now: Date = new Date()): boolean => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const windowStart = station.windowStartHour * 60 + station.windowStartMinute;
  const windowEnd = station.windowEndHour * 60 + station.windowEndMinute;
  return currentMinutes >= windowStart && currentMinutes <= windowEnd;
};

// Helper: Kiểm tra xem đã qua giờ kết thúc chưa
export const isStationMissed = (station: StationMeta, now: Date = new Date()): boolean => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const windowEnd = station.windowEndHour * 60 + station.windowEndMinute;
  return currentMinutes > windowEnd;
};

// Helper: Kiểm tra xem đã đến giờ bắt đầu chưa (cho tương lai)
export const isStationFuture = (station: StationMeta, now: Date = new Date()): boolean => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const windowStart = station.windowStartHour * 60 + station.windowStartMinute;
  return currentMinutes < windowStart;
};

// Helper: Format cửa sổ thời gian hiển thị
export const formatStationWindow = (station: StationMeta): string => {
  const fmt = (h: number, m: number) =>
    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  return `${fmt(station.windowStartHour, station.windowStartMinute)} – ${fmt(station.windowEndHour, station.windowEndMinute)}`;
};
