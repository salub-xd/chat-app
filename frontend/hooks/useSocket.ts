// hooks/useSocket.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
// import Cookies from 'js-cookie'; // or use localStorage if preferred

const useSocket = (userId: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const isConnected = useRef(false); // Track connection status
  useEffect(() => {
    if (!userId || isConnected.current) return;

    const socketInstance = io('http://localhost:5000', {
      reconnectionAttempts: 5,  // optional: limit reconnection attempts
      reconnectionDelay: 500,  // optional: set delay between reconnections
      query: { userId}
    });

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setSocket(socketInstance);
      isConnected.current = true;
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      isConnected.current = false;
    });

    // return () => {
    //   socketInstance.disconnect();
    //   isConnected.current = false;
    // };
  }, [socket, userId]);


  return socket;
};

export default useSocket;
