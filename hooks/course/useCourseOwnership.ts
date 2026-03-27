// hooks/course/useCourseOwnership.ts 
import { useCallback, useState } from 'react';
import courseApi from '../../api/courseApi';

export const useCourseOwnership = () => {
  const [hasBought, setHasBought] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  const checkOwnership = useCallback(async (courseId: string) => {
    try {
      setLoading(true);
      
      const res = await courseApi.checkPaymentStatus(courseId);
      if (res.status === 200) {
        setHasBought(true);
      }
    } catch (err: any) {
      setHasBought(false);
      console.log("Khóa học này chưa được sở hữu/kích hoạt.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    hasBought,
    loading,
    checkOwnership
  };
};