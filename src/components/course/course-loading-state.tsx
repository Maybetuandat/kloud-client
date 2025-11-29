import { Loader2 } from "lucide-react";
import React from "react";

export const CoursesLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
      <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-500" />
      <p className="text-lg font-medium">Đang tải danh sách khóa học...</p>
      <p className="mt-1 text-sm text-gray-400">Vui lòng đợi trong giây lát</p>
    </div>
  );
};

export const CoursesSkeletonGrid: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-lg border shadow-sm"
        >
          <div className="h-48 w-full bg-gray-200"></div>
          <div className="space-y-3 p-5">
            <div className="h-6 rounded bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200"></div>
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 w-20 rounded bg-gray-200"></div>
              <div className="h-10 w-24 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
