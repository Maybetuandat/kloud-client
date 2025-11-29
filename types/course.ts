export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  shortDescription: string;
  level: string;
  price: string;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  category: string;
  level: string;
  price: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

export interface CourseFilters {
  search: string;
  category: string;
  level: string;
  sortBy: "newest" | "oldest" | "title" | "price";
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
