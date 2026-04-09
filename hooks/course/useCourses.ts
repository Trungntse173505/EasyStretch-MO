// hooks/course/useCourses.ts
import { useEffect, useState } from 'react';
import courseApi, { Course } from '../../api/courseApi'; // Nhớ trỏ đúng đường dẫn

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [boughtCourses, setBoughtCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allData = await courseApi.getAll();

      let parsedBought: Course[] = [];
      try {
        const boughtDataRaw = await courseApi.getBought();
        // Kiểm tra an toàn và Flatten dữ liệu từ { courses: {...} } về {...}
        const rawList = Array.isArray(boughtDataRaw) ? boughtDataRaw : ((boughtDataRaw as any)?.data || []);
        parsedBought = rawList.map((item: any) => item.courses || item);
      } catch (err: any) {
        const errDump = JSON.stringify(err.response?.data || err.message);
        setError("Lấy Khoá Đã Mua Lỗi: " + errDump);
      }

      setBoughtCourses(parsedBought);

      // Lọc: Mảng Khám phá (courses) = Toàn bộ KHÔNG NẰM TRONG mảng Đã Mua
      const boughtIds = new Set(parsedBought.map((c: Course) => String(c.id)));
      const exploreData = allData.filter((c: Course) => !boughtIds.has(String(c.id)));
      
      setCourses(exploreData);

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
    boughtCourses,
    loading, 
    error, 
    refetch: fetchCourses 
  };
};