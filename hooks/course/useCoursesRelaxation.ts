import { useMemo } from 'react';
import { useCourses } from './useCourses';


export const useCoursesRelaxation = () => {
    const { courses, boughtCourses, loading, error, refetch } = useCourses();
    const filteredCourses = useMemo(() => {
        return courses.filter(
            (course) => course.type === 'free' && course.level === 'relaxation'
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