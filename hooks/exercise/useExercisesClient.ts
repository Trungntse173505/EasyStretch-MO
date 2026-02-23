// hooks/exercise/useExercisesClient.ts
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
      
      // Lọc lấy những bài tập "free" theo yêu cầu
      const freeExercises = data.filter(ex => ex.type === 'free');
      setExercises(freeExercises);
    } catch (err: any) {
      console.error("Lỗi fetch exercises:", err);
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