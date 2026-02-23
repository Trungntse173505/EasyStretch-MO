// hooks/course/useCourses.ts
import { useEffect, useState } from 'react';
import courseApi, { Course } from '../../api/courseApi'; // Nhớ trỏ đúng đường dẫn

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseApi.getAll();
      setCourses(data);
    } catch (err: any) {
      console.error("Lỗi khi fetch courses:", err);
      setError("Không thể tải danh sách khóa học. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi API khi component sử dụng hook này được mount
  useEffect(() => {
    fetchCourses();
  }, []);

  return { 
    courses, 
    loading, 
    error, 
    refetch: fetchCourses // Trả về hàm refetch để có thể gọi lại API khi kéo xuống refresh (Pull-to-refresh)
  };
};