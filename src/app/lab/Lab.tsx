import { FC } from "react";
import { useParams } from "react-router-dom";
import Terminal from "./terminal/Terminal";

const Lab: FC = () => {
  const { labId, sessionId } = useParams<{
    labId: string;
    sessionId: string;
  }>();

  const parsedLabId = labId ? parseInt(labId, 10) : undefined;
  const parsedSessionId = sessionId ? parseInt(sessionId, 10) : undefined;

  if (!parsedLabId || !parsedSessionId) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Lỗi: Không tìm thấy ID của Lab hoặc Session trong URL.
      </div>
    );
  }

  return <Terminal labId={parsedLabId} labSessionId={parsedSessionId} />;
};

export default Lab;
