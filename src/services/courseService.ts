import {
  Course,
  CreateCourseRequest,
  PaginatedResponse,
  UpdateCourseRequest,
} from "@/types/course";
import { api } from "../lib/api";

export const courseService = {
  /**
   * Get all courses (without pagination)
   */
  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get<{ data: Course[] }>("/courses");
    return response.data;
  },

  /**
   * Get courses with pagination
   */
  getCoursesPaginated: async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    level?: string;
  }): Promise<PaginatedResponse<Course>> => {
    const queryParams: Record<string, any> = {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
    };

    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }

    if (params.category && params.category !== "all") {
      queryParams.category = params.category;
    }

    if (params.level && params.level !== "all") {
      queryParams.level = params.level;
    }

    return api.get<PaginatedResponse<Course>>("/courses", queryParams);
  },

  /**
   * Get course by ID
   */
  getCourseById: async (id: number): Promise<Course> => {
    return api.get<Course>(`/courses/${id}`);
  },

  /**
   * Create new course
   */
  createCourse: async (course: CreateCourseRequest): Promise<Course> => {
    return api.post<Course>("/courses", course);
  },

  /**
   * Update existing course
   */
  updateCourse: async (
    id: number,
    course: UpdateCourseRequest,
  ): Promise<Course> => {
    return api.patch<Course>(`/courses/${id}`, course);
  },

  /**
   * Delete course
   */
  deleteCourse: async (id: number): Promise<void> => {
    return api.delete<void>(`/courses/${id}`);
  },
};
