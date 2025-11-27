import { useState, useEffect } from 'react';

/**
 * Hook để kết nối WebSocket và lắng nghe thời gian từ server.
 * @param labSessionId ID của phiên lab
 * @returns Chuỗi thời gian (ví dụ: "59:59")
 */
export const useLabTimer = (labSessionId: number) => {
  // Trạng thái ban đầu là "Waiting..."
  // Phản ánh đúng trạng thái "pending" ở backend
  const [timerDisplay, setTimerDisplay] = useState<string>("Waiting...");
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  useEffect(() => {
    // 1. Chỉ kết nối nếu có labSessionId hợp lệ
    if (!labSessionId || labSessionId === 0) {
      setTimerDisplay("Invalid ID");
      return;
    }

    // 2. Tạo kết nối WebSocket đến endpoint bạn đã cấu hình
    // Đổi 'ws' thành 'wss' (WebSocket Secure) khi deploy
    const wsUrl = `ws://localhost:8080/ws/lab-timer/${labSessionId}`;
    const ws = new WebSocket(wsUrl);

    // 3. Xử lý khi mở kết nối
    ws.onopen = () => {
      console.log(`WebSocket connected for timer (Session ID: ${labSessionId})`);
    };

    // 4. Xử lý khi nhận tin nhắn (Phần quan trọng nhất)
    ws.onmessage = (event) => {
      const message = event.data;

      if (message === "TIME_UP") {
        setTimerDisplay("00:00");
        setIsTimeUp(true);
        ws.close();
      } else if (message === "SETUP_FAILED") {
        setTimerDisplay("Setup Failed");
        ws.close();
      } else {
        setTimerDisplay(message);
      }
    };

    // 5. Xử lý lỗi
    ws.onerror = (error) => {
      console.error("WebSocket timer error:", error);
      setTimerDisplay("Error");
    };

    // 6. Xử lý khi đóng kết nối
    ws.onclose = (event) => {
      console.log("WebSocket timer disconnected.", event.reason);
      // Nếu nó chưa kết thúc (TIME_UP), bạn có thể muốn hiển thị "Disconnected"
      if (timerDisplay !== "00:00" && timerDisplay !== "Error") {
         setTimerDisplay("Offline");
      }
    };

    // 7. Cleanup function (Rất quan trọng)
    // Sẽ được gọi khi component unmount (thoát khỏi trang lab)
    // để đóng kết nối WebSocket, kích hoạt afterConnectionClosed ở backend.
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };

  }, [labSessionId]); // Hook sẽ chỉ chạy lại nếu `labSessionId` thay đổi

  return { timerDisplay, isTimeUp };
};