import React, { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// --- Các UI Component (giữ nguyên) ---
const Button: FC<{
  children: React.ReactNode;
  className?: string;
  size?: string;
}> = ({ children, className }) => (
  <button
    className={`rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${className}`}
  >
    {children}
  </button>
);
const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);
const Tabs: FC<{
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
}> = ({ children }) => <div>{children}</div>;
const TabsContent: FC<{
  children: React.ReactNode;
  value: string;
  className?: string;
}> = ({ children, className }) => <div className={className}>{children}</div>;
const FlaskConical: FC<{ className?: string }> = ({ className }) => (
  <span className={className}>🧪</span>
);

// --- Định nghĩa Types (giữ nguyên) ---
interface Lab {
  id: number;
  title: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  labs: Lab[];
}

// --- Component chính ---
const CourseDetailPage: FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect để fetch data từ API thật
  useEffect(() => {
    if (!courseId) {
      setError("ID của khóa học không hợp lệ.");
      setLoading(false);
      return;
    }

    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `http://localhost:8080/api/courses/${courseId}/detail`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Lỗi từ server: ${response.status} - ${
              errorText || "Không thể lấy dữ liệu"
            }`,
          );
        }

        // Parse dữ liệu JSON từ response
        const data: Course = await response.json();
        setCourse(data);
      } catch (err: any) {
        // Bắt các lỗi (lỗi mạng, lỗi parse JSON, lỗi ném ra từ response.ok)
        console.error("Lỗi khi fetch dữ liệu khóa học:", err);
        setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      } finally {
        // Dù thành công hay thất bại, luôn tắt trạng thái loading
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]); // Hook sẽ chạy lại mỗi khi courseId thay đổi

  // Các phần xử lý UI (loading, error, render) giữ nguyên như trước
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-12 text-center text-lg font-semibold">
          Đang tải dữ liệu khóa học...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto p-12 text-center text-lg text-red-600">
          Lỗi: {error}
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto p-12 text-center">
          Không có dữ liệu để hiển thị.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* TOÀN BỘ NỘI DUNG GIỜ ĐÂY NẰM TRONG CÙNG MỘT HỆ THỐNG GRID.
            Chúng ta không còn hai khối div riêng biệt nữa.
        */}
      <div className="to-background bg-gradient-to-r from-blue-50/10 via-blue-50/5 p-5">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* --- CỘT BÊN TRÁI (2/3 CHIỀU RỘNG) --- */}
            <div className="lg:col-span-2">
              {/* Phần tiêu đề và mô tả (giữ nguyên) */}
              <h1 className="text-foreground mb-4 text-4xl font-bold">
                {course.title}
              </h1>
              <p className="mb-6 text-lg text-gray-500">{course.description}</p>
              <Tabs defaultValue="curriculum" className="w-full">
                <TabsContent value="curriculum" className="mt-2">
                  <div className="space-y-4">
                    <div className="bg-card rounded-lg border">
                      <div className="p-4">
                        <h3 className="text-xl font-semibold">
                          Nội dung khóa học
                        </h3>
                      </div>
                      <div className="divide-y">
                        {course.labs.map((lab) => (
                          <Link
                            key={lab.id}
                            to={`/courses/${course.id}/labs/${lab.id}/start`}
                            className="flex items-center gap-3 p-4 hover:bg-gray-50"
                          >
                            <FlaskConical className="text-blue-500" />
                            <p>{lab.title}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* --- CỘT BÊN PHẢI (1/3 CHIỀU RỘNG) --- */}
            <div className="lg:col-span-1">
              <div className="bg-card sticky top-4 overflow-hidden rounded-lg border shadow-lg">
                <img
                  src={
                    "https://images.viblo.asia/fad7cf1a-772f-43e4-9042-e96d5d903b2b.png"
                  }
                  alt={course.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <Button className="w-full" size="lg">
                    Bắt đầu học
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetailPage;
