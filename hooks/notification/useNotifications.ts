import { useState } from "react";

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');

  // Tạm thời tắt Firebase đi để Google Sign-in chạy mượt
  // Sau này cần làm thông báo thì tính sau nhé!

  return { expoPushToken };
}