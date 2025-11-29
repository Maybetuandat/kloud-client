import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";

interface CoursesErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const CoursesErrorState: React.FC<CoursesErrorStateProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
      <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
      <h3 className="mb-2 text-xl font-semibold">Đã xảy ra lỗi</h3>
      <p className="mb-6 max-w-md text-red-600">{error}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </button>
      )}

      <div className="mt-4 text-sm text-red-500">
        <p>Nếu lỗi vẫn tiếp tục, vui lòng liên hệ quản trị viên</p>
      </div>
    </div>
  );
};
