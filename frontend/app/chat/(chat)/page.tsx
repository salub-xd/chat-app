// 'use client';

// import { useEffect, useState, useRef, useContext } from 'react';
// import { useParams } from 'next/navigation';
// import useSocket from '@/hooks/useSocket';
// import { jwtDecode } from 'jwt-decode';
// import Cookies from 'js-cookie';
// // import axios from 'axios';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { FaUser, FaUserNinja } from 'react-icons/fa';
// import { ChatContext } from '@/context/ChatContext';
// import ChatContact from "@/components/app/Chat-Contact";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import { UserContext } from '@/context/UserContext';

// // interface Message {
// //   id: string;
// //   senderId: string;
// //   receiverId: string;
// //   senderName: string;
// //   receiverName: string;
// //   senderImage: string;
// //   message: string;
// // }

// interface DecodedToken {
//   id: string;
//   email: string;
// }

// const Chat = () => {
//   const { messages, addMessage, chatUsers, fetchChatUsers, typingStatus, setTypingStatus, selectedContact, fetchMessagesSelectUser, setSelectedContact } = useContext(ChatContext)!;
//   const { user } = useContext(UserContext)!;
//   // const [message, setMessage] = useState("");

//   // const params = useParams();
//   // const token = Cookies.get('token');
//   // const decodedToken: DecodedToken | null = token ? jwtDecode<DecodedToken>(token) : null;
//   // const userId = decodedToken?.id;
//   // const receiverId = params.receiverId;
//   const userId = user?.id;

//   const [message, setMessage] = useState('');
//   // const [messages, setMessages] = useState<Message[]>([]);
//   // const [typingStatus, setTypingStatus] = useState<string | null>(null); // Typing status
//   const socket = useSocket();
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const messageEndRef = useRef<HTMLDivElement | null>(null); // Ref to message container

//   // Fetch old messages when component loads
//   useEffect(() => {
//     console.log(user);
//     if (user) {
//       fetchChatUsers(user.id);
//     }
//     // setSelectedContact(sele)
//   }, [fetchChatUsers, user, selectedContact]);

//   // Set up socket event listeners
//   // useEffect(() => {
//   //   if (!socket || !userId || !receiverId) return;

//   //   socket.emit('join', { userId, receiverId });

//   //   // Listen for typing events
//   //   socket.on('user_typing', ({ senderId }) => {
//   //     if (senderId !== userId) {
//   //       setTypingStatus('User is typing...');
//   //     }
//   //   });

//   //   // Stop typing event
//   //   socket.on('stop_typing', ({ senderId }) => {
//   //     if (senderId !== userId) {
//   //       setTypingStatus(null);
//   //     }
//   //   });

//   //   // Listen for received messages
//   //   // socket.on('receive_message', (data: Message) => {
//   //   //   setMessages((prevMessages) => [...prevMessages, data]);
//   //   // });

//   //   return () => {
//   //     socket.off('user_typing');
//   //     socket.off('stop_typing');
//   //     socket.off('receive_message');
//   //     socket.disconnect();
//   //   };
//   // }, [socket, userId, receiverId, setTypingStatus]);

//   // Scroll to bottom when messages change
//   const scrollToBottom = () => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();

//     // if (!socket || !userId || !receiverId) return;

//     // Mark messages as read when opening chat
//     // const markMessagesAsSeen = async () => {
//     //   try {
//     //     await axios.post(`http://localhost:5000/api/messages/mark-seen/${userId}`, {
//     //       contactId: receiverId,
//     //     });
//     //  socket.emit('mark_as_read', { senderId:userId, receiverId });
//     //   } catch (error) {
//     //     console.error('Failed to mark messages as seen', error);
//     //   }
//     // };

//     // markMessagesAsSeen();
//   }, [messages]);

//   // Handle typing event emission
//   // const handleTyping = () => {
//   //   if (socket) {
//   //     socket.emit('typing', { senderId: userId, receiverId });

//   //     if (typingTimeoutRef.current) {
//   //       clearTimeout(typingTimeoutRef.current);
//   //     }

//   //     typingTimeoutRef.current = setTimeout(() => {
//   //       socket.emit('stop_typing', { senderId: userId, receiverId });
//   //     }, 2000); // Stop typing after 2 seconds of inactivity
//   //   }
//   // };

//   const sendMessage = async () => {
//     if (!socket || !selectedContact || !message.trim()) return;
//     console.log('sendMessage');


//     const messageData = {
//       senderId: user?.id,
//       receiverId: selectedContact,
//       message: message,
//     };
//     addMessage(messageData);
//     // socket.emit('send_message', messageData);
//     setMessage('');
//     // socket.emit('stop_typing', { senderId: userId, receiverId });
//   };



//   return (
//     <div className="flex flex-col overflow-hidden h-screen">
//       <div className="flex justify-center h-full w-full">
//         <ResizablePanelGroup
//           direction="horizontal"
//           className="w-full h-full border rounded-lg"
//         >
//           <ResizablePanel defaultSize={25} minSize={20}>
//             <div className="h-full">
//               <ChatContact />
//             </div>
//           </ResizablePanel>
//           <ResizableHandle />
//           <ResizablePanel defaultSize={75} minSize={40}>
//             <div className="h-full flex items-center justify-center"> {/* Adjusted padding */}
//               <div className="flex flex-col w-full h-screen bg-gray-100">
//                 <header className="bg-black text-white p-4 ">
//                   <h1 className="text-xl font-semibold">
//                     {messages[0]?.receiverName || "Unknown Receiver"}
//                   </h1>
//                 </header>

//                 <div className="flex-1 overflow-y-auto px-3 pt-6 chat-scroll-bar">
//                   {messages.length > 0 ? (
//                     messages.map((message, index) => (
//                       <div key={index} className={`flex mb-4 ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>
//                         {message.senderId !== userId && (
//                           <Avatar className="mr-2">
//                             <AvatarImage src={message.senderImage} />
//                             <AvatarFallback>
//                               <FaUser />
//                             </AvatarFallback>
//                           </Avatar>
//                         )}
//                         <div className={`max-w-[70%] md:max-w-[50%] lg:max-w-[40%] p-3 rounded-lg ${message.senderId === userId ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-black'} shadow-md`}>
//                           <p className="break-words leading-relaxed font-medium text-sm overflow-hidden">{message.message}</p>
//                         </div>
//                         {message.senderId === userId && (
//                           <Avatar className="ml-2">
//                             <AvatarImage src={message.senderImage} />
//                             <AvatarFallback>
//                               <FaUserNinja />
//                             </AvatarFallback>
//                           </Avatar>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No messages found</p>
//                   )}
//                   <div ref={messageEndRef} />
//                   {typingStatus && <div className="text-gray-500 italic">{typingStatus}</div>}
//                 </div>

//                 <footer className="bg-gray-100 border-t p-4">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="text"
//                       value={message}
//                       onChange={(e) => {
//                         setMessage(e.target.value);
//                         // handleTyping();
//                       }}
//                       className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none"
//                       placeholder="Type a message..."
//                     />
//                     <button onClick={sendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded-md whitespace-nowrap">
//                       Send
//                     </button>
//                   </div>
//                 </footer>
//               </div>
//             </div>
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
//     </div>



//   );
// };

// export default Chat;

































// 'use client';

// import { useEffect, useState, useRef, useContext } from 'react';
// import useSocket from '@/hooks/useSocket';
// // import axios from 'axios';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { FaUser, FaUserNinja } from 'react-icons/fa';
// import { ChatContext } from '@/context/ChatContext';
// import ChatContact from "@/components/app/Chat-Contact";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import { UserContext } from '@/context/UserContext';

// // interface Message {
// //   id: string;
// //   senderId: string;
// //   receiverId: string;
// //   senderName: string;
// //   receiverName: string;
// //   senderImage: string;
// //   message: string;
// // }

// const Chat = () => {

//   const [message, setMessage] = useState('');
//   // const [messages, setMessages] = useState<Message[]>([]);
//   // const [typingStatus, setTypingStatus] = useState<string | null>(null); // Typing status
//   const socket = useSocket();
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const messageEndRef = useRef<HTMLDivElement | null>(null); // Ref to message container

//   // Fetch old messages when component loads
//   useEffect(() => {
//     console.log(user);
//     if (user) {
//       fetchChatUsers(user.id);
//     }
//     // setSelectedContact(sele)
//   }, [fetchChatUsers, user, selectedContact]);

//   // Set up socket event listeners
//   // useEffect(() => {
//   //   if (!socket || !userId || !receiverId) return;

//   //   socket.emit('join', { userId, receiverId });

//   //   // Listen for typing events
//   //   socket.on('user_typing', ({ senderId }) => {
//   //     if (senderId !== userId) {
//   //       setTypingStatus('User is typing...');
//   //     }
//   //   });

//   //   // Stop typing event
//   //   socket.on('stop_typing', ({ senderId }) => {
//   //     if (senderId !== userId) {
//   //       setTypingStatus(null);
//   //     }
//   //   });

//   //   // Listen for received messages
//   //   // socket.on('receive_message', (data: Message) => {
//   //   //   setMessages((prevMessages) => [...prevMessages, data]);
//   //   // });

//   //   return () => {
//   //     socket.off('user_typing');
//   //     socket.off('stop_typing');
//   //     socket.off('receive_message');
//   //     socket.disconnect();
//   //   };
//   // }, [socket, userId, receiverId, setTypingStatus]);

//   // Scroll to bottom when messages change
//   const scrollToBottom = () => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();

//     // if (!socket || !userId || !receiverId) return;

//     // Mark messages as read when opening chat
//     // const markMessagesAsSeen = async () => {
//     //   try {
//     //     await axios.post(`http://localhost:5000/api/messages/mark-seen/${userId}`, {
//     //       contactId: receiverId,
//     //     });
//     //  socket.emit('mark_as_read', { senderId:userId, receiverId });
//     //   } catch (error) {
//     //     console.error('Failed to mark messages as seen', error);
//     //   }
//     // };

//     // markMessagesAsSeen();
//   }, [messages]);

//   // Handle typing event emission
//   // const handleTyping = () => {
//   //   if (socket) {
//   //     socket.emit('typing', { senderId: userId, receiverId });

//   //     if (typingTimeoutRef.current) {
//   //       clearTimeout(typingTimeoutRef.current);
//   //     }

//   //     typingTimeoutRef.current = setTimeout(() => {
//   //       socket.emit('stop_typing', { senderId: userId, receiverId });
//   //     }, 2000); // Stop typing after 2 seconds of inactivity
//   //   }
//   // };

//   const sendMessage = async () => {
//     if (!socket || !selectedContact || !message.trim()) return;
//     console.log('sendMessage');


//     const messageData = {
//       senderId: user?.id,
//       receiverId: selectedContact,
//       message: message,
//     };
//     // addMessage(messageData);
//     socket.emit('send_message', messageData);
//     setMessage('');
//     // socket.emit('stop_typing', { senderId: userId, receiverId });
//   };



//   return (
//     <div className="flex flex-col overflow-hidden h-screen">
//       <div className="flex justify-center h-full w-full">
//         <ResizablePanelGroup
//           direction="horizontal"
//           className="w-full h-full border rounded-lg"
//         >
//           <ResizablePanel defaultSize={25} minSize={20}>
//             <div className="h-full">
//               <ChatContact />
//             </div>
//           </ResizablePanel>
//           <ResizableHandle />
//           <ResizablePanel defaultSize={75} minSize={40}>
//             <div className="h-full flex items-center justify-center"> {/* Adjusted padding */}
//               <div className="flex flex-col w-full h-screen bg-gray-100">
//                 <header className="bg-black text-white p-4 ">
//                   <h1 className="text-xl font-semibold">
//                     {messages[0]?.receiverName || "Unknown Receiver"}
//                   </h1>
//                 </header>

//                 <div className="flex-1 overflow-y-auto px-3 pt-6 chat-scroll-bar">
//                   {messages.length > 0 ? (
//                     messages.map((message, index) => (
//                       <div key={index} className={`flex mb-4 ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>
//                         {message.senderId !== userId && (
//                           <Avatar className="mr-2">
//                             <AvatarImage src={message.senderImage} />
//                             <AvatarFallback>
//                               <FaUser />
//                             </AvatarFallback>
//                           </Avatar>
//                         )}
//                         <div className={`max-w-[70%] md:max-w-[50%] lg:max-w-[40%] p-3 rounded-lg ${message.senderId === userId ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-black'} shadow-md`}>
//                           <p className="break-words leading-relaxed font-medium text-sm overflow-hidden">{message.message}</p>
//                         </div>
//                         {message.senderId === userId && (
//                           <Avatar className="ml-2">
//                             <AvatarImage src={message.senderImage} />
//                             <AvatarFallback>
//                               <FaUserNinja />
//                             </AvatarFallback>
//                           </Avatar>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No messages found</p>
//                   )}
//                   <div ref={messageEndRef} />
//                   {typingStatus && <div className="text-gray-500 italic">{typingStatus}</div>}
//                 </div>

//                 <footer className="bg-gray-100 border-t p-4">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="text"
//                       value={message}
//                       onChange={(e) => {
//                         setMessage(e.target.value);
//                         // handleTyping();
//                       }}
//                       className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none"
//                       placeholder="Type a message..."
//                     />
//                     <button onClick={sendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded-md whitespace-nowrap">
//                       Send
//                     </button>
//                   </div>
//                 </footer>
//               </div>
//             </div>
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
//     </div>



//   );
// };

// export default Chat;









































































'use client';

import { useEffect, useState, useRef } from 'react';
import useSocket from '@/hooks/useSocket';
// import axios from 'axios';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser, FaUserNinja } from 'react-icons/fa';
import ChatContact from "@/components/app/Chat-Contact";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/redux/store';
import { Messages } from '@/types';
import { addMessage, updateLastMessage } from '@/redux/reducers/chat';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { ChatHeader } from '@/components/app/Chat-Header';
import { BsEmojiNeutral } from 'react-icons/bs';
import { Button } from '@/components/ui/button';

const Chat = () => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Messages[]>([]);
  // const [user, setUser] = useState<User | null>(null);
  const [typingStatus, setTypingStatus] = useState<string | null>(null); // Typing status
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | undefined>();
  const messageEndRef = useRef<HTMLDivElement | null>(null); // Ref to message container
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showEmojiReaction, setShowEmojiReaction] = useState<boolean>(false);
  const [pickerPosition, setPickerPosition] = useState<{ x: number; y: number } | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const selectedUser = useSelector((state: RootState) => state.chat.selectedConversation);
  const conversationId = useSelector((state: RootState) => state.chat.selectedConversationId);
  const dispatch = useDispatch();
  const socket = useSocket(user.id as string);
  console.log("socket userId = ", user.id);

  // console.log(user);

  // Fetch old messages when component loads
  useEffect(() => {
    console.log(selectedUser);
    const fetchUserChat = async () => {
      if (user && selectedUser) {
        try {
          const response = await axios.get(`http://localhost:5000/api/getMessages?conversationId=${conversationId}`, { withCredentials: true });
          console.log(response.data);
          setMessages(response.data);
        }
        catch (error) {
          console.log(error);
        }
      }
    }
    fetchUserChat();
    // setSelectedContact(sele)
  }, [user, selectedUser, conversationId]);

  // Set up socket event listeners
  useEffect(() => {
    console.log('socket useeffect');

    if (!socket || !user.id) return;
    console.log('socket useEffect - socket and user ID available');

    // socket.on('user_status',({userId,status})=>{
    //   if(userId!==user.id){
    //     status 
    //   }
    // })

    if (conversationId) {
      socket.emit('join_conversation', { conversationId, userId: user.id });
    }

    // Listen for typing events
    socket.on('user_typing', ({ senderId }) => {
      if (senderId !== user.id) {
        console.log("user_typing");

        setTypingStatus('User is typing...');
      }
    });

    // // Stop typing event
    socket.on('stop_typing', ({ senderId }) => {
      if (senderId !== user.id) {
        console.log("user_stop_typing");
        setTypingStatus(null);
      }
    });

    // Listen for received messages
    socket.on('receive_message', (data: Messages) => {
      console.log('Received message:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
      dispatch(addMessage(data)); // Add message to current messages list
      dispatch(updateLastMessage({ conversationId: data.conversationId, message: data })); // Update last message in conversations
    });

    // return () => {
    // socket.off('user_typing');
    // socket.off('stop_typing');
    socket.off('receive_message');
    // socket.disconnect();
    // };
  }, [conversationId, dispatch, socket, user]);

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
  }, [messages]);

  // Handle typing event emission
  const handleTyping = () => {
    if (socket) {
      console.log("user_tying handleTyping ");

      socket.emit('user_typing', { conversationId, userId: user.id });
      console.log("user_tying handleTyping 1 ");

      if (typingTimeoutRef.current) {
        console.log("user_tying handleTyping 2 ");

        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        console.log("user_tying handleTyping 3 ");

        socket.emit('stop_typing', { conversationId, userId: user.id });
      }, 2000); // Stop typing after 2 seconds of inactivity
    }
  };

  const sendMessage = async () => {
    if (!socket || !conversationId || !user?.id || !message.trim()) return;
    console.log('sendMessage');

    const messageData = {
      userId: user?.id,
      conversationId: conversationId,
      message: message,
    };
    console.log(messageData);

    // addMessage(messageData);
    socket.emit('send_message', messageData);
    setMessage('');
    // socket.emit('stop_typing', { senderId: userId, receiverId });
  };

  const onClickEmoji = (emojiData: EmojiClickData) => {
    console.log(emojiData);
    if (emojiData) {
      setMessage((prevEmoji) => prevEmoji + emojiData.emoji);
    }

  }
  const onClickEmojiReaction = (emojiData: EmojiClickData, messageId: string) => {
    console.log(emojiData);
    if (!socket || !conversationId || !user || !messageId) return;

    socket.emit('send_reaction', {
      messageId: messageId,
      userId: user.id,
      emoji: emojiData.emoji
    });

    setMessages((prevMessages) => prevMessages.map((msg) =>
      msg.id === messageId ? { ...msg, reactions: [...(msg.Reaction || []), emojiData.emoji] } : msg))
    // prevMessages.map((msg) =>
    //   msg.id === messageId ? { ...msg, reactions: [...(msg.reactions || []), emojiData.emoji] } : msg
    // )
    setShowEmojiReaction(false);
    setPickerPosition(null);
  }

  // Show emoji picker for reactions
  const onReactionClick = (event: React.MouseEvent, messageId: string) => {
    setShowEmojiPicker(false);
    setShowEmojiReaction(!showEmojiReaction);
    setSelectedMessageId(messageId); // Track which message emoji is for
    setPickerPosition({ x: event.clientX, y: event.clientY });
  };

  const removeReaction = (id: string, messageId: string) => {
    if (!socket || !conversationId || !user || !id || !messageId) return;
    console.log(id, messageId);

    socket.emit('remove_reaction', {
      reactionId: id,
      messageId: messageId,
    });
  }

  return (
    <div className="flex flex-col overflow-hidden h-screen">
      <div className="flex justify-center h-full w-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full border rounded-lg"
        >
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full">
              <ChatContact />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75} minSize={40}>
            <div className="h-full flex items-center justify-center"> {/* Adjusted padding */}
              <div className="flex flex-col w-full h-screen bg-gray-100">
                <ChatHeader selectedUser={selectedUser} />

                <div className="flex-1 overflow-y-auto px-3 pt-6 chat-scroll-bar">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div key={index} className={`flex mb-4 ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                        {message.senderId !== user?.id && (
                          <Avatar className="mr-2">
                            <AvatarImage src={message.sender.image} />
                            <AvatarFallback>
                              <FaUser />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <ContextMenu>
                          <div onClick={(e) => onReactionClick(e, message?.id as string)} className={`max-w-[70%] md:max-w-[50%] lg:max-w-[40%] cursor-pointer p-3 rounded-lg gap-y-2 ${message.senderId === user?.id ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-black'} shadow-md`}>
                            <ContextMenuTrigger className='flex  w-auto items-center justify-center'>
                              <p className="  break-words leading-relaxed font-medium text-sm overflow-hidden">{message.message}</p>
                              <div className="flex justify-center px-1 gap-1 mt-1 rounded-full bg-sky-500">
                                {message.Reaction && message.Reaction.map((reaction, idx) => (
                                  <span key={idx} onClick={() => removeReaction(reaction?.id as string, reaction?.messageId as string)} className="text-lg">{reaction.emoji}</span>
                                ))}
                              </div>
                            </ContextMenuTrigger>
                          </div>
                          <ContextMenuContent>
                            <ContextMenuItem>Edit Message <Pencil1Icon className='ml-2 w-4 h-4' /></ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem className=' text-red-500'>Delete Message <TrashIcon className='ml-2 w-4 h-4' /></ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                        {message.senderId === user?.id && (
                          <Avatar className="ml-2">
                            <AvatarImage src={message.sender.image} />
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
                {/* for sending emoji  */}
                {showEmojiPicker && (
                  <div onMouseLeave={() => setShowEmojiPicker(false)} style={{ position: 'absolute', bottom: '70px', zIndex: 10 }} >
                    <EmojiPicker open={showEmojiPicker} onEmojiClick={onClickEmoji} />
                  </div>
                )}
                {/* for reacion emoji  */}
                {showEmojiReaction && pickerPosition && (
                  <div
                    style={{
                      position: 'absolute',
                      left: pickerPosition.x - 300,
                      top: pickerPosition.y - 80, // Position above the message
                      // bottom: pickerPosition.y - 180,  // Position above the message 
                      zIndex: 10,
                    }}
                    className='pointer'
                    onMouseLeave={() => setShowEmojiReaction(false)}
                  >
                    <EmojiPicker reactionsDefaultOpen={showEmojiReaction} onReactionClick={(emojiData) => selectedMessageId && onClickEmojiReaction(emojiData, selectedMessageId)} />
                  </div>
                )}
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
                    <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="bg-indigo-500 text-white dark:text-black rounded-md whitespace-nowrap">
                      <BsEmojiNeutral className='w-4 h-4' />
                    </Button>
                    <Button onClick={sendMessage} className="bg-indigo-500 text-white dark:text-black rounded-md whitespace-nowrap">
                      Send
                    </Button>
                  </div>
                </footer>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Chat;