'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import useSocket from "@/hooks/useSocket";
import axios from "axios";
import { UserContext } from "./UserContext";

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    receiverName: string;
    senderImage: string;
    message: string;
}

interface ChatUser {
    id: string;
    name: string;
    image: string;
    lastMessage: string;
    unseenMessagesCount: number;
    isRead: boolean;
    lastMessageTime: string;
}

interface ChatContextType {
    messages: Message[];
    addMessage: (message: Message) => void;
    fetchMessages: (userId: string, receiverId: string) => void;
    typingStatus: string | null;
    setTypingStatus: (status: string | null) => void;
    chatUsers: ChatUser[];
    fetchChatUsers: (userId: string) => void;
    selectedContact: string;
    fetchMessagesSelectUser: (selectedContact: string) => void;
    setSelectedContact: (user: string | null) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useContext(UserContext)!;
    const socket = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
    const [typingStatus, setTypingStatus] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<string | undefined>(undefined);

    const userId = user?.id;

    useEffect(() => {
        console.log(socket,userId);
        
        if (!socket || !userId) return;

        console.log("Setting up socket listeners");

        const handleReceiveMessage = (message: Message) => {
            console.log("Received message:", message);
            setMessages((prevMessages) => [...prevMessages, message]);

            setChatUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user.id === message.senderId || user.id === message.receiverId) {
                        return {
                            ...user,
                            lastMessage: message.message,
                            lastMessageTime: new Date().toISOString(),
                            unseenMessagesCount:
                                message.receiverId === userId && user.id === message.senderId
                                    ? user.unseenMessagesCount + 1
                                    : user.unseenMessagesCount,
                        };
                    }
                    return user;
                })
            );
        };

        // Attach event listeners
        socket.on("receive_message", handleReceiveMessage);
        socket.on("user_typing", () => setTypingStatus("User is typing..."));
        socket.on("stop_typing", () => setTypingStatus(null));

        // Clean up listeners on unmount
        return () => {
            console.log("Cleaning up socket listeners");
            socket.off("receive_message", handleReceiveMessage);
            socket.off("user_typing");
            socket.off("stop_typing");
        };
    }, [socket, userId]); // Add userId as a dependency to ensure it re-runs when userId changes

    const fetchChatUsers = async (userId:string) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/userContacts/${userId}`, { withCredentials: true });
          console.log("response data", response.data);
          setChatUsers(response.data);
        } catch (error) {
          console.error('Error fetching chat users:', error);
        }
      };

    const addMessage = (message: Message) => {
        console.log("add message", message);
        if (socket) socket.emit("send_message ",message); // Emit to server
    };

    const fetchMessagesSelectUser = async (selectUser: string) => {
        if (userId && selectUser) {
            console.log("select user", selectUser);
            setSelectedContact(selectUser);
            try {
                const response = await axios.get('http://localhost:5000/api/messages', {
                    withCredentials: true, params: { userId, receiverId: selectUser }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching old messages:', error);
            }
        }
    };

    return (
        <ChatContext.Provider value={{
            messages, chatUsers,fetchChatUsers, addMessage, typingStatus, setTypingStatus,
            selectedContact, setSelectedContact, fetchMessagesSelectUser
        }}>
            {children}
        </ChatContext.Provider>
    );
};
