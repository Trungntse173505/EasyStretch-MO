// hooks/course/useCourses.ts
import { useCallback, useEffect, useState } from 'react';
import courseApi, { Course } from '../../api/courseApi';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [boughtCourses, setBoughtCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const allData = await courseApi.getAll();

      let parsedBought: Course[] = [];
      try {
        const boughtDataRaw = await courseApi.getBought();
        const rawList = Array.isArray(boughtDataRaw) ? boughtDataRaw : ((boughtDataRaw as any)?.data || []);
        parsedBought = rawList
          .map((item: any) => item.courses || item)
          .filter((c: Course) => String(c.id) !== '49414f0c-ea91-4ded-bd2d-3536c2ea82e5');
      } catch (err: any) {
        const errDump = JSON.stringify(err.response?.data || err.message);
        setError("Lấy Khoá Đã Mua Lỗi: " + errDump);
      }

      setBoughtCourses(parsedBought);

      const boughtIds = new Set(parsedBought.map((c: Course) => String(c.id)));
      const exploreData = allData.filter(
        (c: Course) => !boughtIds.has(String(c.id)) &&
          String(c.id) !== '49414f0c-ea91-4ded-bd2d-3536c2ea82e5');

      setCourses(exploreData);

    } catch (err: any) {
      console.log("Lỗi khi fetch courses:", err);
      setError("Không thể tải danh sách khóa học. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    boughtCourses,
    loading,
    error,
    refetch: fetchCourses
  };
};