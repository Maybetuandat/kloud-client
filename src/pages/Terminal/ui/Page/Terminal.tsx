import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  MoreHorizontal,
  Square,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Console from "./Console";
// Giữ nguyên import QuestionProps
import { Question, QuestionProps } from "./Question"; 
import { useLabTimer } from "@/hooks/useLabTimer";

// --- Định nghĩa Types ---
type TerminalProps = {
  labId: number;
  labSessionId: number;
};
// ... (các interface API giữ nguyên)
interface AnswerFromApi { id: number; content: string; isRightAns: boolean; }
interface QuestionFromApi { id: number; question: string; solution: string; hint: string; answers: AnswerFromApi[]; typeQuestion: string; }
interface LabDetailsFromApi { id: number; title: string; estimatedTime: number; }
interface QuestionsApiResponse { data: QuestionFromApi[]; }


// --- THAY ĐỔI #1: TẠO MỘT KIỂU DỮ LIỆU MỚI CHO STATE ---
// Kiểu này là QuestionProps, nhưng LOẠI BỎ (Omit) trường 'labSessionId'
type QuestionData = Omit<QuestionProps, 'labSessionId'>;


const Terminal: React.FC<TerminalProps> = ({ labId, labSessionId }) => {
  const navigate = useNavigate();

  // --- State ---
  const [labName, setLabName] = useState<string>("");
  
  // --- THAY ĐỔI #2: SỬ DỤNG KIỂU DỮ LIỆU MỚI CHO STATE ---
  const [questions, setQuestions] = useState<QuestionData[]>([]); 
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { timerDisplay, isTimeUp } = useLabTimer(labSessionId);

  // useEffect để tải dữ liệu (đã sửa lại dùng Promise.all cho hiệu quả)
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [labDetailsResponse, questionsResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/labs/${labId}`),
          fetch(`http://localhost:8080/api/labs/${labId}/questions`)
        ]);

        if (!labDetailsResponse.ok) throw new Error("Không thể tải thông tin lab.");
        const labData: LabDetailsFromApi = await labDetailsResponse.json();
        setLabName(labData.title);

        if (!questionsResponse.ok) throw new Error("Không thể tải câu hỏi.");
        const questionsApi: QuestionsApiResponse = await questionsResponse.json();
        const questionsFromApi = questionsApi.data;
        if (!Array.isArray(questionsFromApi)) throw new Error("Dữ liệu câu hỏi không hợp lệ.");
        
        // --- THAY ĐỔI #3: SỬ DỤNG KIỂU DỮ LIỆU MỚI Ở ĐÂY ---
        const formattedQuestions: QuestionData[] = questionsFromApi.map(q => ({
          ...q,
          listAnswer: q.answers,
        }));
        setQuestions(formattedQuestions);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      document.body.style.overflow = "";
    };
  }, [labId]);

  // Hàm nộp bài (không đổi)
  const handleSubmitLab = useCallback(async () => {
    if (isSubmitting) return; 

    if (window.confirm("Bạn có chắc chắn muốn kết thúc và nộp bài lab này không?")) {
      setIsSubmitting(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/lab-sessions/${labSessionId}/submit`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi nộp bài.");
        }
        navigate(`/result`);
      } catch (error) {
        console.error("Không thể nộp bài:", error);
        navigate(`/result`);
      }
    }
  }, [labSessionId, navigate, isSubmitting]);

  // Effect tự động nộp bài khi hết giờ (không đổi)
  useEffect(() => {
    if (isTimeUp) {
      alert("Hết giờ! Bài lab của bạn sẽ được nộp tự động.");
      handleSubmitLab();
    }
  }, [isTimeUp, handleSubmitLab]);

  // Hàm chuyển câu hỏi (không đổi)
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Hàm render sidebar (không đổi)
  const renderSidebarContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-gray-500">
          <Loader2 className="mb-2 h-8 w-8 animate-spin" />
          <span>Đang tải câu hỏi...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center text-red-600">
          <AlertCircle className="mb-2 h-8 w-8" />
          <span className="font-semibold">Đã xảy ra lỗi</span>
          <span>{error}</span>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="flex h-full items-center justify-center text-gray-500">
          <span>Lab này không có câu hỏi trắc nghiệm.</span>
        </div>
      );
    }

    // Logic này VẪN ĐÚNG, vì ta truyền labSessionId vào thủ công
    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <Question
          {...questions[currentQuestionIndex]}
          labSessionId={labSessionId} 
        />
      </>
    );
  };

  // Giao diện JSX (không đổi)
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
              <span className="font-bold text-white">i</span>
            </div>
            <span className="font-semibold text-gray-800">imissu</span>
          </div>
          <div className="hidden items-center gap-2 text-sm text-gray-500 md:flex">
            <Clock size={16} className="text-blue-500" />
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600">
              In Progress
            </span>
            <span>{isLoading ? 'Đang tải...' : `Lab: ${labName}`}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="rounded border border-blue-200 bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-200">
            Report an Issue
          </button>
          <button 
            className="rounded bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
            onClick={handleSubmitLab}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang nộp..." : "Mark Complete"}
          </button>
          <div className="ml-4 flex items-center gap-1">
            <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
              <ChevronLeft size={16} />
            </button>
            <button className="rounded p-1 text-gray-500 hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="ml-2 h-8 w-8 rounded-full bg-gray-800"></div>
        </div>
      </header>

      <main className="flex flex-1 pt-16">
        <aside className="hidden w-80 flex-col border-r border-gray-200 bg-white md:flex">
          <div className="flex items-center justify-center gap-2 border-b border-gray-100 p-4">
            <Clock size={16} className="text-gray-500" />
            <span className="font-mono text-lg text-gray-800">
              {timerDisplay}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {renderSidebarContent()}
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 bg-white p-2 px-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-800">Terminal</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 disabled:cursor-not-allowed disabled:text-red-300"
                onClick={handleSubmitLab}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Đang nộp bài...</span>
                  </>
                ) : (
                  <>
                    <Square size={12} className="fill-current text-red-500" />
                    <span>Stop Lab</span>
                  </>
                )}
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <ExternalLink size={12} />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-gray-800">
            {labSessionId ? (
              <Console labSessionId={labSessionId} />
            ) : (
              <div className="p-5 font-mono text-yellow-400">
                Đang chờ thông tin phiên lab... (Không tìm thấy sessionId)
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terminal;