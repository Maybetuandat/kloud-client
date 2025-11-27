import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react"; // Thêm icon để hiển thị trạng thái

// --- CÁC COMPONENT HELPER CỦA BẠN (giữ nguyên) ---
const Button: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <button className={`px-4 py-2 rounded ${className}`}>{children}</button>;
const Badge: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <span className={`p-1 px-2 text-xs rounded ${className}`}>{children}</span>;
const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;


// --- BƯỚC 1: ĐỊNH NGHĨA TYPE CHO DỮ LIỆU KHÓA HỌC MÀ FRONTEND SẼ DÙNG ---
interface Course {
  id: number;
  title: string;
  description: string;
  image: string; // Giữ lại trường image theo yêu cầu
  category: string;
  level: string;
  price: string;
}

const CoursesListPage: FC = () => {
  // --- BƯỚC 2: QUẢN LÝ CÁC TRẠNG THÁI CỦA COMPONENT ---
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- BƯỚC 3: GỌI API KHI COMPONENT ĐƯỢC MOUNT ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/courses');
        
        if (!response.ok) {
          throw new Error('Không thể tải danh sách khóa học từ server.');
        }

        const apiData = await response.json();
        const mappedCourses = apiData.data.map((apiCourse: any): Course => ({
          id: apiCourse.id,
          title: apiCourse.title,
          description: apiCourse.description,
          level: apiCourse.level || 'Mọi cấp độ',
          category: apiCourse.category || 'Chưa phân loại',
          
          image: "https://images.viblo.asia/e60190b9-574c-4144-9eb0-8d3a54d3cd6a.png",
          price: "Miễn phí",
        }));

        setCourses(mappedCourses);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Dù thành công hay thất bại, cũng dừng loading
      }
    };

    fetchCourses();
  }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần duy nhất

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-primary/5 to-background p-5">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-5xl">Khám phá các khóa học</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          {/* --- BƯỚC 5: HIỂN THỊ CÓ ĐIỀU KIỆN DỰA TRÊN TRẠNG THÁI --- */}

          {/* Trạng thái Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center text-gray-500">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="mt-4 text-lg">Đang tải danh sách khóa học...</p>
            </div>
          )}

          {/* Trạng thái Lỗi */}
          {error && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
              <AlertTriangle className="h-12 w-12" />
              <p className="mt-4 text-lg font-semibold">Đã xảy ra lỗi</p>
              <p>{error}</p>
            </div>
          )}

          {/* Trạng thái Thành công */}
          {!isLoading && !error && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-lg">
                  <div className="relative overflow-hidden">
                    <img src={course.image} alt={course.title} className="h-48 w-full object-cover" />
                    <Badge className="absolute right-3 top-3 bg-blue-500 text-white">{course.category}</Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-xl font-bold text-foreground">{course.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-500">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">{course.price}</span>
                      <Button className="bg-blue-500 text-white group-hover:bg-blue-600">Xem chi tiết</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
        </div>
      </div>
    </MainLayout>
  )
}

export default CoursesListPage;