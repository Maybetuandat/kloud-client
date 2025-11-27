import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShieldCheck,
  XCircle,
  Loader2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StartLab: FC = () => {
  const labSessionUrl: string = "http://localhost:8080/api/lab-sessions";
  const labNameUrl: string = `http://localhost:8080/api/labs/`;

  const { courseId, labId } = useParams<{ courseId: string; labId: string }>();
  const navigate = useNavigate();

  const [labName, setLabName] = useState<string>("");
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    if (!labId) {
      setPageError("Không tìm thấy ID của lab trong URL.");
      setIsPageLoading(false);
      return;
    }

    const fetchLabDetails = async () => {
      try {
        const response = await fetch(labNameUrl + `${labId}`);
        if (!response.ok) {
          throw new Error("Không thể tải thông tin lab từ server.");
        }
        const labData = await response.json();
        setLabName(labData.title);
      } catch (err: any) {
        setPageError(err.message);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchLabDetails();
  }, [labId]);

  const handleStartLab = async () => {
    setIsStarting(true);
    setStartError(null);
    const userId = 1;

    try {
      const response = await fetch(labSessionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labId: parseInt(labId!, 10),
          userId: userId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể khởi tạo lab.");
      }
      const sessionId = data.sessionId;
      if (!sessionId) {
        throw new Error("Không nhận được sessionId từ server.");
      }
      navigate(`/labs/${labId}/${sessionId}`);
    } catch (err: any) {
      setStartError(err.message);
    } finally {
      setIsStarting(false);
    }
  };

  const renderMainContent = () => {
    if (isPageLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span className="mt-4 text-lg">Đang tải thông tin lab...</span>
        </div>
      );
    }

    if (pageError) {
      return (
        <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Đã xảy ra lỗi
          </h2>
          <p className="py-4 text-red-600">{pageError}</p>
        </div>
      );
    }

    // Giao diện chính khi đã tải xong
    return (
      <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-lg">
        <ShieldCheck className="mx-auto h-16 w-16 text-blue-500" />
        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          Bắt đầu môi trường thực hành?
        </h2>
        <p className="py-4 text-gray-600">
          Một môi trường lab riêng biệt sẽ được khởi tạo cho bạn. Bạn đã sẵn
          sàng để bắt đầu chưa?
        </p>
        {startError && (
          <div className="mt-4 flex items-center gap-3 rounded-md bg-red-100 p-3 text-sm text-red-700">
            <XCircle className="h-5 w-5 flex-shrink-0" />
            <span>{startError}</span>
          </div>
        )}
        <div className="mt-6 flex w-full justify-center gap-4">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex w-1/2 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            disabled={isStarting}
          >
            <XCircle className="h-5 w-5" />
            Hủy bỏ
          </button>
          <button
            onClick={handleStartLab}
            className="flex w-1/2 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            disabled={isStarting}
          >
            {isStarting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang khởi tạo...</span>
              </>
            ) : (
              "Bắt đầu Lab"
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 font-sans">
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
              <span className="font-bold text-white">i</span>
            </div>
            <span className="font-semibold text-gray-800">imissu</span>
          </div>
          <div className="hidden items-center gap-2 text-sm text-gray-500 md:flex">
            <Clock size={16} className="text-blue-500" />
            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
              In Progress
            </span>
            {/* --- THAY ĐỔI #4: HIỂN THỊ TÊN LAB TỪ STATE --- */}
            <span>{isPageLoading ? "Loading..." : `Lab: ${labName}`}</span>
          </div>
        </div>
        {/* Các nút bên phải */}
        <div className="flex items-center gap-2">
          <button className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Report an Issue
          </button>
          <button className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
            Mark Complete
          </button>
          <div className="ml-4 flex items-center gap-1">
            <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
              <ChevronLeft size={20} />
            </button>

            <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="ml-2 h-9 w-9 rounded-full bg-gray-300"></div>{" "}
          {/* Placeholder for Avatar */}
        </div>
      </header>
      <main className="flex h-screen items-center justify-center p-4 pt-16">
        {renderMainContent()}
      </main>
    </div>
  );
};
export default StartLab;
