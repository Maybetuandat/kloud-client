import { CoursesErrorState } from "@/src/components/course/course-error-state";
import { CourseGrid } from "@/src/components/course/course-grid";
import { CoursesHeader } from "@/src/components/course/course-header";
import { CoursesLoadingState } from "@/src/components/course/course-loading-state";
import { MainLayout } from "@/src/components/ui/layout/main-layout";
import React from "react";
import { useCourses } from "./use-course";

const CoursesListPage: React.FC = () => {
  const { courses, loading, error, refetch } = useCourses({
    page: 1,
    pageSize: 12, // Hiển thị nhiều hơn cho trang danh sách
    autoFetch: true,
  });

  return (
    <MainLayout>
      <CoursesHeader />

      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && <CoursesLoadingState />}

        {/* Error State */}
        {error && !loading && (
          <CoursesErrorState error={error} onRetry={refetch} />
        )}

        {/* Success State - Course Grid */}
        {!loading && !error && <CourseGrid courses={courses} />}
      </div>
    </MainLayout>
  );
};

export default CoursesListPage;
