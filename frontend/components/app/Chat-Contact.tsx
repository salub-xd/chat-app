'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';

interface ChatUser {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
}



const ChatContact = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const router = useRouter();

  useEffect(()=>{
    setChatUsers([
      {
        id:'1',
        name:'nubie',
        image:'',
        lastMessage: 'yes wow',
        unreadCount: 1,
        lastMessageTime: '2pm',
      },
      {
        id:'1',
        name:'nubie',
        image:'',
        lastMessage: 'yes wow',
        unreadCount: 1,
        lastMessageTime: '2pm',
      },
      {
        id:'1',
        name:'nubie',
        image:'',
        lastMessage: 'yes wow',
        unreadCount: 1,
        lastMessageTime: '2pm',
      }
    ])
  },[])
    

  return (
    <div className=" bg-white border-gray-300">
      <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-black text-white">
        <h1 className="text-2xl font-semibold">Kisaner Chat</h1>
      </header>

      {/* Contact List */}
      <div className="overflow-y-auto chat-scroll-bar h-screen p-3 mb-9 pb-20">
        {chatUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 gap-x-2 rounded-md"
            onClick={() => router.push(`/market/chat/${user.id}`)}
          >
            <Avatar>
              <AvatarImage src={user.image as string} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold dark:text-black">{user.name}</h2>
              <p className="text-gray-600">{user.lastMessage || 'No messages yet'}</p>
              <span className="text-sm text-gray-500">{user.lastMessageTime}</span>
            </div>
            {user.unreadCount > 0 && (
              <span className="ml-2 text-sm text-red-500">{user.unreadCount} unread</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatContact;
