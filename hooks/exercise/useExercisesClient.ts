// hooks/exercise/useExercisesClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage'; // Bổ sung import
import { useCallback, useEffect, useState } from 'react';
import exerciseApi, { Exercise } from '../../api/exerciseApi';

export const useExercisesClient = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exerciseApi.getAllClient();
      const userInfoStr = await AsyncStorage.getItem("USER_INFO");
      let isVip = false;
      if (userInfoStr) {
        const user = JSON.parse(userInfoStr);
        isVip = user.is_subscriber === 'active';
      }
      if (isVip) {
        setExercises(data);
      } else {
        const freeExercises = data.filter((ex: Exercise) => ex.type === 'free');
        setExercises(freeExercises);
      }

    } catch (err: any) {
      console.log("Lỗi fetch exercises:", err);
      setError("Không thể tải danh sách bài tập.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return { exercises, loading, error, refetch: fetchExercises };
};