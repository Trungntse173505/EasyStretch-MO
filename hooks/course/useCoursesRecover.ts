import { useMemo } from 'react';
import { useCourses } from './useCourses';


export const useCoursesRecover = () => {
    const { courses, boughtCourses, loading, error, refetch } = useCourses();
    const filteredCourses = useMemo(() => {
        return courses.filter(
            (course) => course.level === 'recover'
        );
    }, [courses]);
    return {
        courses: filteredCourses,
        boughtCourses,
        loading,
        error,
        refetch
    };
};