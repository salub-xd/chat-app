export interface User {
    id: string | undefined;
    name: string | undefined;
    username: string | undefined;
    bio: string | undefined;
    image: string | undefined;
}

export interface Messages {
    id: string | undefined,
    message: string | undefined,
    senderId: string | undefined,
    isDelivered: boolean | undefined,
    isRead: boolean | undefined,
    createdAt: Date | undefined,
    conversationId: string | undefined,
    sender: {
        id: string | undefined,
        name: string | undefined,
        username: string | undefined,
        image: string | undefined,
    };
    Reaction: [
        {
            id: string | undefined,
            emoji: string | undefined,
            userId: string | undefined,
            messageId: string | undefined,
        }
    ];
}

export interface Conversations {
    id: string | undefined,
    lastMessageId: string | undefined,
    lastMessageAt: string | undefined,
    isPinned: boolean | undefined,
    isGroup: boolean | undefined,
    adminId: string | undefined,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
    ConversationUser: [
        {
            user: User
        }
    ];
    lastMessage: {
        id: string | undefined,
        message: string | undefined,
        senderId: string | undefined,
        isDelivered: boolean | undefined,
        isRead: boolean | undefined,
        createdAt: Date | undefined,
        conversationId: string | undefined
    }
}