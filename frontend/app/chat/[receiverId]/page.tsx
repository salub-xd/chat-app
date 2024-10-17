'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useSocket from '@/hooks/useSocket';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaUser, FaUserNinja } from 'react-icons/fa';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  senderImage: string;
  message: string;
}

interface DecodedToken {
  id: string;
  email: string;
}

const Chat = () => {
  const params = useParams();
  const token = Cookies.get('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode<DecodedToken>(token) : null;
  const userId = decodedToken?.id;
  const receiverId = params.receiverId;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();

  useEffect(() => {
    const fetchOldMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messages', {
          params: { userId, receiverId },
        });
        setMessages(response.data);  // Set old messages
      } catch (error) {
        console.error('Error fetching old messages:', error);
      }
    };

    fetchOldMessages();  // Call the function to fetch old messages
  }, [userId, receiverId]);

  useEffect(() => {
    if (!socket || !userId || !receiverId) return;

    socket.emit('join', { userId, receiverId });

    socket.on('receive_message', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, userId, receiverId]);

  const sendMessage = () => {
    if (!socket || !receiverId) return;

    const messageData = {
      senderId: userId,
      receiverId: receiverId,
      message: message,
    };

    socket.emit('send_message', messageData);
    setMessage('');
  };

  return (
    <div className="flex-1">
      <header className="bg-white p-4 text-gray-700">
        {messages.length > 0 ? (
          <h1 className="text-2xl font-semibold">
            {messages[0]?.receiverName ? "Chat with " + messages[0].receiverName : "Unknown Receiver"}
          </h1>
        ) : (
          <p>No messages found</p>
        )}
      </header>

      <div className="h-screen overflow-y-auto chat-scroll-bar pb-16">
        <div className="p-4 min-h-screen pb-20">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${message?.senderId === userId ? 'justify-end' : ''}`}
            >
              {message?.senderId !== userId && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                  <Avatar>
                    <AvatarImage src={message?.senderImage} />
                    <AvatarFallback>
                      <FaUser />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div className={`flex max-w-96 ${message.senderId === userId ? 'bg-indigo-500 text-white' : 'bg-white'} rounded-lg p-3 gap-3`}>
                <p className="text-gray-700">{message.message}</p>
              </div>
              {message.senderId === userId && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                  <Avatar>
                    <AvatarImage src={message.senderImage} />
                    <AvatarFallback>
                      <FaUserNinja />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          ))}
        </div>

        <footer className="flex flex-col  w-full  bg-white border-t border-gray-300 p-4 border">
          <div className="flex items-center gap-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded-md">
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
