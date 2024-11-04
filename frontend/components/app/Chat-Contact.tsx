'use client';

import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { useRouter } from 'next/navigation';
// // import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import Cookies from 'js-cookie';
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { conversations, fetchAllConversations, setSelectedConversation, setSelectedConversationId } from '@/redux/reducers/chat';
import { cn } from '@/lib/utils';
import { FaUser } from 'react-icons/fa';
import { selectUser } from '@/redux/reducers/auth';
import { Conversations, User } from '@/types';
// import useSocket from '@/hooks/useSocket';
// import { ChatContext } from '@/context/ChatContext';


// interface DecodedToken {
//   id: string;
//   email: string;
// }

const ChatContact = () => {
  // const { chatUsers,fetchMessagesSelectUser } = useContext(ChatContext)!;
  // console.log(chatUsers);


  // const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  // const router = useRouter();

  // const token = Cookies.get('token');
  // const decodedToken: DecodedToken | null = token ? jwtDecode<DecodedToken>(token) : null;
  // const userId = decodedToken?.id;

  // const socket = useSocket();

  // useEffect(() => {
  //   console.log("/chat log");

  //   const fetchOldMessages = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:5000/api/userContacts/${userId}`);
  //       setChatUsers(response.data);
  //     } catch (error) {
  //       console.error('Error fetching old messages:', error);
  //     }
  //   };

  //   fetchOldMessages();

  //   if (socket) {
  //     // Listen for new messages and update the chat list
  //     console.log('if condition receive message ');
  //     socket.on('receive_message', (message) => {
  //       console.log('receive message ');

  //       setChatUsers((prevUsers) => {
  //         return prevUsers.map((user) => {
  //           if (user.id === message.senderId || user.id === message.receiverId) {
  //             return {
  //               ...user,
  //               lastMessage: message.message,
  //               lastMessageTime: new Date().toISOString(), // Update last message time
  //               unseenMessagesCount: message.receiverId === userId && user.id === message.senderId
  //                 ? user.unseenMessagesCount + 1
  //                 : user.unseenMessagesCount, // Increment if the current user is the receiver
  //             };
  //           }
  //           return user;
  //         });
  //       });
  //     });

  //     socket.on('mark_as_read', ({ senderId }) => {
  //       setChatUsers((prevUsers) =>
  //         prevUsers.map((user) => {
  //           if (user.id === senderId) {
  //             return { ...user, unseenMessagesCount: 0 }; // Mark messages as read for this user
  //           }
  //           return user;
  //         })
  //       );
  //     });

  //     return () => {
  //       socket.off('receive_message');
  //       socket.off('mark_as_read');
  //     };
  //   }
  // }, [userId, socket]);

  const user: User = useSelector(selectUser);
  const chats: Conversations[] = useSelector(conversations);
  // const conversationUser = useSelector((state: RootState) => state.chat.selectedConversation);
  const conversationUserId = useSelector((state: RootState) => state.chat.selectedConversationId);
  const dispatch = useDispatch<AppDispatch>();
  // const [chats, setChats] = useState();
  // console.log(user);


  useEffect(() => {
    console.log('chat useEFfect');
    if (user?.id) {
      dispatch(fetchAllConversations(user.id as string));

    }
  }, [user, dispatch]);

  const setConversation = (user: User, userId: string) => {
    dispatch(setSelectedConversation(user));
    dispatch(setSelectedConversationId(userId))
  }

  return (
    <div className="bg-gray-100  h-full overflow-y-auto">
      {/* Header */}
      <header className="p-4 bg-black text-white">
        <h1 className="text-xl font-semibold">Chat App</h1>
      </header>

      {/* Contact List */}
      <div className="p-3">
        {chats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No contacts available</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(`flex items-center mb-4 cursor-pointer hover:bg-gray-200 p-2 gap-x-2 rounded-md transition duration-200 ease-in-out ${chat.id === conversationUserId && 'bg-gray-300'}`)}
              onClick={() => setConversation(chat.ConversationUser[0].user, chat.id as string)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={chat.ConversationUser[0].user.image}
                  alt={chat.ConversationUser[0].user.name}
                />
                <AvatarFallback>
                  {/* {user.ConversationUser[0].user.name} */}
                  <FaUser className='w-4 h-4' />

                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-black">{chat.ConversationUser[0].user.name || 'Unknown'}</h2>
                <p className="text-gray-600 truncate">{chat?.lastMessage?.message || 'No messages yet'}</p>
                <span className="text-sm text-gray-500">
                  {chat.lastMessageAt
                    && format(new Date(chat.lastMessageAt), 'MMM dd, yyyy, h:mm a')
                  }
                </span>
              </div>

              {/* {chat. > 0 && (
                <span className="ml-2 text-xs text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full">
                  {user.unseenMessagesCount} unread message(s)
                </span>
              )} */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatContact;
