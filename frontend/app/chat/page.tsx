'use client';
// components/Chat.tsx
import React, { useState } from 'react';
import useSocket from '@/hooks/useSocket';

const ChatComponent = () => {
  const socket = useSocket();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (socket) {
      socket.emit('message', message); // Send message to server
      setMessage(''); // Clear input after sending
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
