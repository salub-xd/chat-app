import { Conversations, Messages } from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { RootState } from '../store';

interface ChatState {
  messages: Messages[],
  selectedConversationId: string | undefined,
  selectedConversation: {
    id: string | undefined,
    name: string | undefined,
    username: string | undefined,
    bio: string | undefined,
    image: string | undefined,
  },
  allConversations: Conversations[];
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | undefined;
}

export const fetchAllConversations = createAsyncThunk('/user/fetchMessages', async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const response = await axios.get(`http://localhost:5000/api/getConversations?userId=${userId}`, { withCredentials: true });
  console.log(response.data);

  return response.data;
});

const initialState: ChatState = {
  messages: [],
  selectedConversationId: undefined,
  selectedConversation: {
    id: undefined,
    name: undefined,
    username: undefined,
    bio: undefined,
    image: undefined,
  },
  allConversations: [
    {
      id: undefined,
      lastMessageId: undefined,
      lastMessageAt: undefined,
      isPinned: undefined,
      isGroup: undefined,
      adminId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      ConversationUser: [
        {
          user: {
            id: undefined,
            name: undefined,
            username: undefined,
            bio: undefined,
            image: undefined,
          }
        }
      ],
      lastMessage: {
        id: undefined,
        message: undefined,
        senderId: undefined,
        isDelivered: undefined,
        isRead: undefined,
        createdAt: undefined,
        conversationId: undefined
      }
    },
  ],
  status: 'idle',
  error: undefined
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conversation = state.allConversations.find(conv => conv.id === conversationId);
      if (conversation) {
        conversation.lastMessage = message;
      }
    },
    setSelectedConversationId(state, action) {
      state.selectedConversationId = action.payload;
    },
    setSelectedConversation(state, action) {
      state.selectedConversation = action.payload;
    },
  }, extraReducers: (builder) => {
    builder.addCase(fetchAllConversations.pending, (state) => {
      state.status = 'loading';
    }).addCase(fetchAllConversations.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.allConversations = action.payload;
    }).addCase(fetchAllConversations.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message
    })
  }
})

// Action creators are generated for each case reducer function
export const { addMessage, updateLastMessage, setSelectedConversationId, setSelectedConversation } = chatSlice.actions

export const conversations = (state: RootState) => state.chat.allConversations;

export default chatSlice.reducer;