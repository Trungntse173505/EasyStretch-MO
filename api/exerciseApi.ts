// api/exerciseApi.ts
import axiosClient from './axiosClient';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  target_muscle: string[];
  created_at: string;
  img_list: string[];
  type: string | null;
}

const exerciseApi = {
  // Lấy danh sách 
  getAllClient: async (): Promise<Exercise[]> => {
    const response = await axiosClient.get('/exercises/client');
    return response.data.data;
  },

  // Lấy chi tiết bài tập theo ID 
  getById: async (id: string): Promise<Exercise> => {
    const response = await axiosClient.get(`/exercises/client/${id}`);
    return response.data.data;
  },
};

export default exerciseApi;