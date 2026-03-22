import axiosClient from './axiosClient';

// --- Interfaces ---
export interface Login {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  token: string; 
}

export interface UpdateUser {
  height_cm: number;
  weight_kg: number;
  gender: string;
  goal: string;
}

export interface UserData {
  id: string;
  full_name: string;
  email: string | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  goal: string | null;
  role: string;
}

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface OtpRequest {
  gmail: string;
}

export interface ResetPassRequest {
  otp: string;
  gmail: string;
  password: string;
}

export interface LeaderboardUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  current_point: number;
}

const authApi = {
  login: (data: Login) => {
    return axiosClient.post<LoginResponse>('/users/signin', data);
  },
  
  register: (data: any) => {
    return axiosClient.post<ApiResponse<any>>('/users/signup', data);
  },
  
  updateInfo: (data: UpdateUser) => {
    return axiosClient.patch<ApiResponse<UserData>>('/users/update', data);
  },
  
  getInfo: () => {
    return axiosClient.get<ApiResponse<UserData>>('/users/profile');
  },

  otp: (data: OtpRequest) => {
    return axiosClient.post<ApiResponse<any>>('/users/otp', data);
  },

  resetpass: (data: ResetPassRequest) =>{
    return axiosClient.post<ApiResponse<any>>('/users/reset', data);
  },

  getLeaderboard: () => {
    return axiosClient.get<ApiResponse<LeaderboardUser[]>>('/users/leaderboard');
  }
};

export default authApi;