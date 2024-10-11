// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_BACKEND_URL); // Point to your Socket.IO server

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketInstance.on('message', (message: string) => {
      console.log('New message received:', message);
    });

    setSocket(socketInstance);

    // Clean up connection when component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
