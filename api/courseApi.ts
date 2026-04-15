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
  type: string;
}

const courseApi = {
  // 1. Lấy danh sách khóa học
  getAll: async (): Promise<Course[]> => {
    const response = await axiosClient.get('/courses');
    return response.data;
  },

  // 1.1 Lấy danh sách khóa học đã mua
  getBought: async (): Promise<Course[]> => {
    const response = await axiosClient.get('/courses/bought');
    return response.data;
  },

  // 2. Kiểm tra xem User đã sở hữu (kích hoạt) khóa học này chưa
  checkPaymentStatus: async (courseId: string) => {
    // API này trả về status nên ta return toàn bộ response để check
    const response = await axiosClient.get(`/courses/payment/${courseId}`);
    return response;
  },

  getdetails: async (): Promise<Course[]> => {
    const response = await axiosClient.get('/courses');
    return response.data;
  },
};

export default courseApi;