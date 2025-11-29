import React, { useState, useEffect } from "react";
// Import thêm các icon cho đúng/sai
import { Loader2, CheckCircle, XCircle, Check, X } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho một câu trả lời
interface Answer {
  id: number;
  content: string;
  isRightAns: boolean;
}

// Định nghĩa props mà component Question nhận vào
interface QuestionProps {
  id: number;
  question: string;
  hint: string;
  solution: string;
  listAnswer: Answer[];
  typeQuestion: string;
  labSessionId: number;
}

const Question: React.FC<QuestionProps> = ({
  id: questionId,
  question,
  hint,
  solution,
  listAnswer,
  typeQuestion,
  labSessionId,
}) => {
  const [activeTab, setActiveTab] = useState<string>("task");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ success: boolean; message: string } | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab("task");
    setSelectedOption(null);
    setIsChecking(false);
    setCheckResult(null);
    setCheckError(null);
  }, [questionId]);

  const handleCheck = async () => {
    setIsChecking(true);
    setCheckResult(null);
    setCheckError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/lab-validation/${labSessionId}/check/${questionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Kiểm tra thất bại do lỗi server.");
      }
      setCheckResult(result);
    } catch (err: any) {
      setCheckError(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const renderTaskContent = () => {
    if (typeQuestion === "non-check") {
      const hasAnswered = selectedOption !== null;

      return (
        <div className="space-y-3"> {/* Tăng khoảng cách giữa các tùy chọn */}
          {listAnswer.map((option: Answer) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.isRightAns;

            // --- CẢI TIẾN CSS Ở ĐÂY ---
            let buttonClass = 
                "w-full flex items-center justify-between rounded-lg border p-4 text-left transition-all duration-200 ease-in-out " + // Thêm flex và transition
                "focus:outline-none focus:ring-2 focus:ring-offset-2 "; // Thêm focus ring

            let textClass = "font-medium text-gray-800"; // Default text color
            let icon = null;

            if (!hasAnswered) {
              // Trạng thái CHƯA TRẢ LỜI
              buttonClass += isSelected
                ? "border-blue-400 bg-blue-50 text-blue-800 shadow-sm" // Chọn
                : "border-gray-300 bg-white hover:border-blue-200 hover:bg-gray-50 focus:ring-blue-500"; // Mặc định và hover
            } else {
              // Trạng thái ĐÃ TRẢ LỜI
              if (isCorrect) {
                // Câu trả lời ĐÚNG
                buttonClass += "border-green-500 bg-green-50 text-green-800 shadow-md";
                textClass = "font-semibold text-green-800";
                icon = <Check className="h-5 w-5 text-green-600" />;
              } else if (isSelected && !isCorrect) {
                // Câu trả lời SAI do người dùng chọn
                buttonClass += "border-red-500 bg-red-50 text-red-800 shadow-md";
                textClass = "font-semibold text-red-800 line-through";
                icon = <X className="h-5 w-5 text-red-600" />;
              } else {
                // Các câu trả lời KHÁC (không phải câu đúng, không phải câu sai đã chọn)
                buttonClass += "border-gray-200 bg-gray-100 text-gray-500 opacity-70 cursor-not-allowed";
                textClass = "text-gray-500";
                // Nếu đây là câu đúng nhưng người dùng chọn sai, vẫn hiển thị màu xanh để chỉ dẫn
                if (option.isRightAns) {
                    buttonClass = "border-green-500 bg-green-50 text-green-800 shadow-md"; // Highlight câu đúng
                    textClass = "font-semibold text-green-800";
                    icon = <Check className="h-5 w-5 text-green-600" />;
                }
              }
            }
            // --- KẾT THÚC CẢI TIẾN CSS ---

            return (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                disabled={hasAnswered}
                className={buttonClass}
              >
                <div className={textClass}>
                  {option.content}
                </div>
                {icon} {/* Hiển thị icon (nếu có) */}
              </button>
            );
          })}
        </div>
      );
    }

    if (typeQuestion === "check") {
      return (
        <div className="space-y-4">
          <button
            onClick={handleCheck}
            disabled={isChecking}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 transition-all duration-200" // Cải thiện nút check
          >
            {isChecking ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang kiểm tra...</span>
              </>
            ) : (
              "Kiểm tra"
            )}
          </button>

          {checkResult?.success === true && (
            <div className="flex items-center gap-3 rounded-md bg-green-100 p-3 text-sm text-green-700 border border-green-200 shadow-sm">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>{checkResult.message}</span>
            </div>
          )}
          {checkResult?.success === false && (
            <div className="flex items-center gap-3 rounded-md bg-red-100 p-3 text-sm text-red-700 border border-red-200 shadow-sm">
              <XCircle className="h-5 w-5 flex-shrink-0" />
              <span>{checkResult.message}</span>
            </div>
          )}

          {checkError && (
            <div className="flex items-center gap-3 rounded-md bg-red-100 p-3 text-sm text-red-700 border border-red-200 shadow-sm">
              <XCircle className="h-5 w-5 flex-shrink-0" />
              <span>Lỗi: {checkError}</span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="flex border-b border-gray-200">
        {["task", "hint", "solution", "assistant"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 border-b-2 p-3 text-sm font-medium capitalize transition-colors duration-200 ${
              activeTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "task" && (
          <div className="space-y-4">
            <p className="leading-relaxed text-gray-800 text-base font-normal mb-6"> {/* Điều chỉnh Typography */}
              {question}
            </p>
            {renderTaskContent()}
          </div>
        )}
        
        {activeTab === "hint" && (
          <div className="space-y-4 rounded-md bg-gray-100 p-4 border border-gray-200">
            <p className="font-mono text-sm text-gray-700">{hint}</p>
          </div>
        )}

        {activeTab === "solution" && (
          <div className="space-y-4 rounded-md bg-gray-800 p-4 border border-gray-700">
            <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap">{solution}</pre> {/* Thêm whitespace-pre-wrap */}
          </div>
        )}

        {activeTab === "assistant" && (
          <div className="space-y-4 rounded-md bg-blue-50 p-4 border border-blue-200">
            <p className="text-blue-700">Tính năng Trợ lý (Beta)</p>
          </div>
        )}
      </div>
    </>
  );
};

export type { Answer, QuestionProps };
export { Question };