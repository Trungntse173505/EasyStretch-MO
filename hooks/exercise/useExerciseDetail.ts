// hooks/exercise/useExerciseDetail.ts
import { useEffect, useState } from 'react';
import exerciseApi, { Exercise } from '../../api/exerciseApi';

export const useExerciseDetail = (id: string) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await exerciseApi.getById(id);
        setExercise(data);
      } catch (err) {
        setError("Không thể tải thông tin bài tập.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return { exercise, loading, error };
};