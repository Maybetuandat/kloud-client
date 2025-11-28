import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface ConsoleProps {
  labSessionId: number;
}

const Console: React.FC<ConsoleProps> = ({ labSessionId }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "failed" | "waiting"
  >("connecting");
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isTerminalReady, setIsTerminalReady] = useState(false); // 🔥 NEW: Track terminal readiness
  const maxReconnectAttempts = 3;

  useEffect(() => {
    if (!terminalRef.current || !labSessionId) {
      return;
    }

    let reconnectTimer: number | null = null;

    const connectWebSocket = () => {
      // Reset states
      setIsTerminalReady(false);
      setConnectionStatus("connecting");

      // --- 1. KHỞI TẠO XTERM.JS ---
      const term = new Terminal({
        cursorBlink: true,
        fontFamily: "monospace",
        fontSize: 14,
        theme: {
          background: "#1f2937",
          foreground: "#d1d5db",
          cursor: "#f97316",
        },
      });
      termRef.current = term;

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.open(terminalRef.current!);
      fitAddon.fit();

      const handleResize = () => fitAddon.fit();
      window.addEventListener("resize", handleResize);

      // --- 2. THIẾT LẬP KẾT NỐI WEBSOCKET ---
      term.write("🔄 Connecting to lab environment...\r\n");

      const wsUrl = `ws://localhost:8080/api/terminal/${labSessionId}`;
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      // --- 3. ĐỊNH NGHĨA CÁC SỰ KIỆN WEBSOCKET ---
      socket.onopen = () => {
        console.log("WebSocket opened successfully");
        setConnectionStatus("connected");
        setReconnectAttempts(0);
        // Send newline to trigger initial prompt
        socket.send("\n");
      };

      socket.onmessage = (event) => {
        console.log("Received from server:", event.data);
        term.write(event.data);

        // 🔥 IMPROVED: Detect when terminal is ready for input
        if (event.data.includes("Terminal connected successfully")) {
          setConnectionStatus("connected");
          setIsTerminalReady(true);
        } else if (event.data.includes("ubuntu@") && event.data.includes("$")) {
          // Shell prompt detected - terminal is ready
          setIsTerminalReady(true);
          setConnectionStatus("connected");
        } else if (
          event.data.includes("Lab is being created") ||
          event.data.includes("Lab environment is being set up") ||
          event.data.includes("Lab virtual machine is starting") ||
          event.data.includes("Please wait")
        ) {
          setConnectionStatus("waiting");
          setIsTerminalReady(false);
        }
      };

      socket.onclose = (event) => {
        const reason = event.reason || "Unknown reason";
        console.log("WebSocket closed:", reason);
        term.write(`\r\n❌ Connection Closed: ${reason}\r\n`);
        setConnectionStatus("failed");
        setIsTerminalReady(false);

        // Auto-reconnect logic
        if (
          reconnectAttempts < maxReconnectAttempts &&
          !reason.includes("Lab setup failed")
        ) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
          term.write(
            `\r\n🔄 Attempting to reconnect in ${delay / 1000} seconds...\r\n`,
          );

          reconnectTimer = window.setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            term.clear();
            connectWebSocket();
          }, delay);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        term.write(
          "\r\n🚨 WebSocket Error. Check the console for details.\r\n",
        );
        setConnectionStatus("failed");
        setIsTerminalReady(false);
      };

      // --- 4. 🔥 FIXED: Simplified keystroke handling ---
      const onDataDisposable = term.onData((data) => {
        console.log("Terminal input:", data); // Debug keystroke

        // 🔥 SIMPLIFIED: Just check if socket is open
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(data);
          console.log("Sent to server:", data);
        } else {
          console.warn("Socket not ready, keystroke ignored:", data);
        }
      });

      // --- 5. CLEANUP ---
      return () => {
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
        }
        onDataDisposable.dispose();
        socket.close();
        term.dispose();
        window.removeEventListener("resize", handleResize);
      };
    };

    const cleanup = connectWebSocket();

    return () => {
      if (cleanup) cleanup();
    };
  }, [labSessionId, reconnectAttempts]);

  // 🔥 Render connection status overlay
  const renderStatusOverlay = () => {
    // Don't show overlay if terminal is ready for input
    if (isTerminalReady) return null;

    const getStatusInfo = () => {
      switch (connectionStatus) {
        case "connecting":
          return {
            text: "Connecting to lab...",
            color: "bg-blue-600",
            spinner: true,
          };
        case "waiting":
          return {
            text: "Lab is being prepared...",
            color: "bg-yellow-600",
            spinner: true,
          };
        case "failed":
          return {
            text:
              reconnectAttempts >= maxReconnectAttempts
                ? "Connection failed. Please refresh the page."
                : "Connection lost. Attempting to reconnect...",
            color: "bg-red-600",
            spinner: reconnectAttempts < maxReconnectAttempts,
          };
        default:
          return {
            text: "Initializing terminal...",
            color: "bg-gray-600",
            spinner: true,
          };
      }
    };

    const { text, color, spinner } = getStatusInfo();

    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
        <div
          className={`${color} flex items-center gap-3 rounded-lg px-6 py-3 text-white shadow-lg`}
        >
          {spinner && (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
          )}
          <span className="font-medium">{text}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full w-full">
      <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />
      {renderStatusOverlay()}
    </div>
  );
};

export default Console;
