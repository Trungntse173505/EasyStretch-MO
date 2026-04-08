// api/missionApi.ts
import axiosClient from './axiosClient';

// --- Interfaces ---
export interface ExerciseDetail {
  id: string;
  type: string | null;
  title: string;
  duration: number; // seconds
  img_list: string[];
  video_url: string | null;
  description: string;
  target_muscle: string[];
}

export interface MissionExercise {
  id: string;
  order: number;
  point: number;
  exercises: ExerciseDetail;
  mission_id: string;
  exercise_id: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  level: string;
  target_date: string;
  mission_exercises: MissionExercise[];
}

// GET /missions?date=YYYY-MM-DD
export const getMissions = async (date?: string) => {
  const response = await axiosClient.get('/missions', {
    params: date ? { date } : undefined,
  });
  return response.data;
};

// POST /missions/complete-exercise
export const completeExercise = async (mission_id: string, exercise_id: string) => {
  const response = await axiosClient.post('/missions/complete-exercise', {
    mission_id,
    exercise_id,
  });
  return response.data;
};
