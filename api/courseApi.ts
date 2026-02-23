// api/courseApi.ts
import axiosClient from './axiosClient';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  created_at: string;
  is_active: boolean;
  price: number;
  img_url: string;
}

export interface PaymentItem {
  name: string; 
  quantity: number;
  price: number;
}

export interface PaymentPayload {
  amount: number;
  description: string;
  items: PaymentItem[];
  returnUrl: string;
  cancelUrl: string;
}

const courseApi = {
  // 1. Lấy danh sách khóa học (Cũ)
  getAll: async (): Promise<Course[]> => {
    const response = await axiosClient.get('/courses');
    return response.data;
  },

  // 2. Kiểm tra xem User đã mua khóa học này chưa (MỚI)
  checkPaymentStatus: async (courseId: string) => {
    // API này trả về status nên ta return toàn bộ response để check
    const response = await axiosClient.get(`/courses/payment/${courseId}`);
    return response; 
  },

  // 3. Tạo link thanh toán PayOS (MỚI)
  createPayment: async (payload: PaymentPayload) => {
    const response = await axiosClient.post('/payos-payment/create', payload);
    return response.data; // Trả về data (thường chứa link checkoutUrl của PayOS)
  }
};

export default courseApi;