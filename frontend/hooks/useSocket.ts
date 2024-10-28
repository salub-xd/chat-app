// hooks/useSocket.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import Cookies from 'js-cookie'; // or use localStorage if preferred

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const isConnected = useRef(false); // Track connection status

  useEffect(() => {
    if (isConnected.current) return; // Prevent re-connecting
    // const token = Cookies.get('token'); // Get the JWT token from cookies

    const socketInstance = io('http://localhost:5000'
      // ,
      //  {
      // auth: {
      //   token, // Send token to backend during connection handshake
      // },
    // }
  );

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
      isConnected.current = true; // Set as connected
    });

    setSocket(socketInstance);

    // Clean up connection when component unmounts
    return () => {
      socketInstance.disconnect();
      isConnected.current = false; // Reset connection status
    };
  }, []);

  return socket;
};

export default useSocket;
