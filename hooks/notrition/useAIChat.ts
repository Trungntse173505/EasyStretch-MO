// hooks/nutrition/useAIChat.ts
import { useCallback, useState } from 'react';
import { askAiNutritionist } from '../../api/nutritionApi';

// Định nghĩa cấu trúc của một tin nhắn
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai'; // Phân biệt ai là người gửi
  content: string;     // Nội dung tin nhắn
  createdAt: Date;     // Thời gian gửi
}

export const useAIChat = () => {
  // Bắt đầu với một tin nhắn chào mừng từ AI
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'ai',
      content: 'Chào bạn! Mình là Chuyên gia Dinh dưỡng AI. Mình có thể giúp gì cho mục tiêu sức khỏe và bữa ăn của bạn hôm nay?',
      createdAt: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm gửi tin nhắn mới
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // 1. Tạo tin nhắn của User và thêm ngay vào UI cho mượt
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      createdAt: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      // 2. Gọi API để hỏi AI
      const response = await askAiNutritionist(text);

      // 3. Lấy câu trả lời và tạo tin nhắn của AI
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), // Tạo ID độc nhất
        role: 'ai',
        content: response.answer || "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.",
        createdAt: new Date(),
      };

      // 4. Cập nhật lại danh sách tin nhắn
      setMessages((prev) => [...prev, aiMsg]);
      
    } catch (err: any) {
      console.error("Lỗi AI Chat:", err);
      setError(err?.response?.data?.message || "Có lỗi xảy ra khi kết nối với Chuyên gia AI.");
      
      // Thêm một tin nhắn báo lỗi vào khung chat để user biết
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'ai',
        content: "⚠️ Rất xin lỗi, đường truyền đang gặp sự cố. Bạn vui lòng thử lại sau nhé!",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm để xóa sạch lịch sử chat (nếu cần)
  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'ai',
        content: 'Chào bạn! Mình là Chuyên gia Dinh dưỡng AI. Mình có thể giúp gì cho mục tiêu sức khỏe và bữa ăn của bạn hôm nay?',
        createdAt: new Date()
      }
    ]);
    setError(null);
  }, []);

  return { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    clearChat 
  };
};