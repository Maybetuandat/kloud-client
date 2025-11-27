import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface ConsoleProps {
  labSessionId: number;
}

const Console: React.FC<ConsoleProps> = ({ labSessionId }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  // Dùng ref để lưu trữ các instance, tránh bị khởi tạo lại mỗi lần re-render
  const termRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Chỉ thực thi khi component được mount lần đầu
    if (!terminalRef.current || !labSessionId) {
      return;
    }

    // --- 1. KHỞI TẠO XTERM.JS ---
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'monospace',
      fontSize: 14,
      theme: {
        background: '#1f2937', // Màu nền giống giao diện của bạn
        foreground: '#d1d5db',
        cursor: '#f97316',
      },
    });
    termRef.current = term;

    // Addon để resize terminal
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // Gắn terminal vào DOM
    term.open(terminalRef.current);
    fitAddon.fit();

    // Lắng nghe sự kiện resize của cửa sổ để điều chỉnh terminal
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    // --- 2. THIẾT LẬP KẾT NỐI WEBSOCKET ---
    term.write(' L ͨ O ͤ A ͥ D ͬ I ͥ N ₲ ... \r\n');
    
    // URL của WebSocket endpoint, trỏ đến backend của bạn
    const wsUrl = `ws://localhost:8080/api/terminal/${labSessionId}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // --- 3. ĐỊNH NGHĨA CÁC SỰ KIỆN WEBSOCKET ---
    socket.onopen = () => {
      term.write('\r\n✅ Connection Established. Welcome to your lab!\r\n\r\n');
      // Gửi một ký tự xuống dòng để kích hoạt dấu nhắc lệnh (prompt)
      socket.send('\n'); 
    };

    // Nhận dữ liệu TỪ backend và ghi ra terminal
    socket.onmessage = (event) => {
      console.log(event.data)
      term.write(event.data);
    };

    socket.onclose = () => {
      term.write('\r\n❌ Connection Closed.\r\n');
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      term.write('\r\n🚨 WebSocket Error. Check the console.\r\n');
    };

    // --- 4. GỬI DỮ LIỆU TỪ TERMINAL ĐẾN BACKEND ---
    // Bắt sự kiện người dùng gõ phím TRONG terminal
    const onDataDisposable = term.onData((data) => {
      // Gửi dữ liệu đó đến backend qua WebSocket
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    // --- 5. DỌN DẸP KHI COMPONENT UNMOUNT ---
    return () => {
      onDataDisposable.dispose();
      socket.close();
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
    
  }, [labSessionId]); // useEffect sẽ chạy lại nếu labSessionId thay đổi

  return (
    <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default Console;