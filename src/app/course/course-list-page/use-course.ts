import { courseService } from "@/src/services/courseService";
import type { Course } from "@/types/course";
import { useCallback, useEffect, useState } from "react";

interface UseCoursesOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  level?: string;
  autoFetch?: boolean;
}

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } | null;
  refetch: () => Promise<void>;
  fetchCourses: (options?: Partial<UseCoursesOptions>) => Promise<void>;
}

export const useCourses = (
  options: UseCoursesOptions = {},
): UseCoursesReturn => {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    category = "",
    level = "",
    autoFetch = true,
  } = options;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } | null>(null);

  const fetchCourses = useCallback(
    async (fetchOptions?: Partial<UseCoursesOptions>) => {
      const params = {
        page: fetchOptions?.page ?? page,
        pageSize: fetchOptions?.pageSize ?? pageSize,
        search: fetchOptions?.search ?? search,
        category: fetchOptions?.category ?? category,
        level: fetchOptions?.level ?? level,
      };

      try {
        setLoading(true);
        setError(null);

        const response = await courseService.getCoursesPaginated(params);

        // Map dữ liệu từ API
        const mappedCourses = response.data.map(
          (apiCourse: any): Course => ({
            id: apiCourse.id,
            title: apiCourse.title,
            description: apiCourse.description,
            level: apiCourse.level || "Mọi cấp độ",
            category: apiCourse.category || "Chưa phân loại",
            image:
              apiCourse.image ||
              "https://images.viblo.asia/e60190b9-574c-4144-9eb0-8d3a54d3cd6a.png",
            price: apiCourse.price || "Miễn phí",
          }),
        );

        setCourses(mappedCourses);
        setPagination({
          currentPage: response.currentPage,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
          hasNext: response.hasNext,
          hasPrevious: response.hasPrevious,
        });
      } catch (err: any) {
        const errorMessage =
          err?.message || "Không thể tải danh sách khóa học từ server.";
        setError(errorMessage);
        setCourses([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search, category, level],
  );

  const refetch = useCallback(() => {
    return fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (autoFetch) {
      fetchCourses();
    }
  }, [fetchCourses, autoFetch]);

  return {
    courses,
    loading,
    error,
    pagination,
    refetch,
    fetchCourses,
  };
};
