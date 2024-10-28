'use client';

import { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'next/navigation';
import useSocket from '@/hooks/useSocket';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
// import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser, FaUserNinja } from 'react-icons/fa';
import { ChatContext } from '@/context/ChatContext';

// interface Message {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   senderName: string;
//   receiverName: string;
//   senderImage: string;
//   message: string;
// }

interface DecodedToken {
  id: string;
  email: string;
}

const Chat = () => {
  const { messages, addMessage,fetchMessages, typingStatus, setTypingStatus } = useContext(ChatContext)!;
  // const [message, setMessage] = useState("");

  const params = useParams();
  const token = Cookies.get('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode<DecodedToken>(token) : null;
  const userId = decodedToken?.id;
  const receiverId = params.receiverId;

  const [message, setMessage] = useState('');
  // const [messages, setMessages] = useState<Message[]>([]);
  // const [typingStatus, setTypingStatus] = useState<string | null>(null); // Typing status
  const socket = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null); // Ref to message container

  // Fetch old messages when component loads
  useEffect(() => {
    if(userId || receiverId){
        fetchMessages(userId as string,receiverId as string);
    }
  }, [userId, receiverId,fetchMessages]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !userId || !receiverId) return;

    socket.emit('join', { userId, receiverId });

    // Listen for typing events
    socket.on('user_typing', ({ senderId }) => {
      if (senderId !== userId) {
        setTypingStatus('User is typing...');
      }
    });

    // Stop typing event
    socket.on('stop_typing', ({ senderId }) => {
      if (senderId !== userId) {
        setTypingStatus(null);
      }
    });

    // Listen for received messages
    // socket.on('receive_message', (data: Message) => {
    //   setMessages((prevMessages) => [...prevMessages, data]);
    // });

    return () => {
      socket.off('user_typing');
      socket.off('stop_typing');
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [socket, userId, receiverId,setTypingStatus]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();

    // if (!socket || !userId || !receiverId) return;

    // Mark messages as read when opening chat
    // const markMessagesAsSeen = async () => {
    //   try {
    //     await axios.post(`http://localhost:5000/api/messages/mark-seen/${userId}`, {
    //       contactId: receiverId,
    //     });
        //  socket.emit('mark_as_read', { senderId:userId, receiverId });
    //   } catch (error) {
    //     console.error('Failed to mark messages as seen', error);
    //   }
    // };

    // markMessagesAsSeen();
  }, [messages, receiverId, userId, socket]);

  // Handle typing event emission
  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { senderId: userId, receiverId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { senderId: userId, receiverId });
      }, 2000); // Stop typing after 2 seconds of inactivity
    }
  };
  
  const sendMessage = async () => {
    if (!socket || !receiverId || !message.trim()) return;

    const messageData = {
      senderId: userId,
      receiverId: receiverId,
      message: message,
    };
    addMessage(messageData);
    // socket.emit('send_message', messageData);
    setMessage('');
    // socket.emit('stop_typing', { senderId: userId, receiverId });
  };



  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
    <header className="bg-black text-white p-4 ">
      <h1 className="text-xl font-semibold">
        {messages[0]?.receiverName || "Unknown Receiver"}
      </h1>
    </header>
  
    <div className="flex-1 overflow-y-auto px-3 pt-6 chat-scroll-bar">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className={`flex mb-4 ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>
            {message.senderId !== userId && (
              <Avatar className="mr-2">
                <AvatarImage src={message.senderImage} />
                <AvatarFallback>
                  <FaUser />
                </AvatarFallback>
              </Avatar>
            )}
            <div className={`max-w-[70%] md:max-w-[50%] lg:max-w-[40%] p-3 rounded-lg ${message.senderId === userId ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-black'} shadow-md`}>
              <p className="break-words leading-relaxed font-medium text-sm overflow-hidden">{message.message}</p>
            </div>
            {message.senderId === userId && (
              <Avatar className="ml-2">
                <AvatarImage src={message.senderImage} />
                <AvatarFallback>
                  <FaUserNinja />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No messages found</p>
      )}
      <div ref={messageEndRef} />
      {typingStatus && <div className="text-gray-500 italic">{typingStatus}</div>}
    </div>
  
    <footer className="bg-gray-100 border-t p-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded-md whitespace-nowrap">
          Send
        </button>
      </div>
    </footer>
  </div>
  
  
  );
};

export default Chat;
