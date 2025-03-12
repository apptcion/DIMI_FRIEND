import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = __DEV__ ? 'https://dimifriend.apptcion.site' : 'https://dimifriend.apptcion.site'

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // autoConnect: false로 설정하여 수동으로 연결 제어
    const socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // 디버깅을 위한 이벤트 리스너들
    socketInstance.on('connect', () => {
      console.log('소켓 연결됨 - Context');
    });

    socketInstance.on('connect_error', (error) => {
      console.log('소켓 연결 에러 - Context:', error);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};