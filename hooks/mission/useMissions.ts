// hooks/mission/useMissions.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { completeExercise as apiCompleteExercise, getMissions, Mission } from '../../api/missionApi';

const getDoneKey = (date: string, exerciseId: string) =>
  `MISSION_DONE_${date}_${exerciseId}`;

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách nhiệm vụ từ API theo ngày
  const fetchMissions = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMissions(date);
      const data: Mission[] = res?.data || [];
      setMissions(data);
      return data;
    } catch (e: any) {
      console.error('Lỗi fetch missions:', e);
      setError('Không thể tải nhiệm vụ hôm nay.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Kiểm tra bài tập nào đã hoàn thành (từ AsyncStorage)
  const getCompletedExercises = useCallback(async (date: string, exerciseIds: string[]): Promise<string[]> => {
    try {
      const keys = exerciseIds.map(id => getDoneKey(date, id));
      const results = await AsyncStorage.multiGet(keys);
      return results
        .filter(([, value]) => value === 'true')
        .map(([key]) => key.replace(`MISSION_DONE_${date}_`, ''));
    } catch {
      return [];
    }
  }, []);

  // Đánh dấu bài tập hoàn thành vào AsyncStorage
  const markExerciseDone = useCallback(async (date: string, exerciseId: string) => {
    try {
      await AsyncStorage.setItem(getDoneKey(date, exerciseId), 'true');
    } catch (e) {
      console.log('Lỗi lưu trạng thái done:', e);
    }
  }, []);

  // Gọi API cộng điểm cho bài tập
  const finishExercise = useCallback(async (
    missionId: string,
    exerciseId: string,
    date: string
  ): Promise<boolean> => {
    try {
      await apiCompleteExercise(missionId, exerciseId);
      await markExerciseDone(date, exerciseId);
      return true;
    } catch (e: any) {
      console.error('Lỗi complete exercise:', e);
      return false;
    }
  }, [markExerciseDone]);

  return {
    missions,
    loading,
    error,
    fetchMissions,
    getCompletedExercises,
    markExerciseDone,
    finishExercise,
  };
};
