// hooks/useSocket.ts
'use client';

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import Cookies from 'js-cookie'; // or use localStorage if preferred

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Retrieve the token from cookies (or localStorage if that's your approach)
    const token = Cookies.get('token');  // Get the JWT token from cookies

    const socketInstance = io('http://localhost:5000', {
      auth: {
        token,  // Send token to backend during connection handshake
      }
    });

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
