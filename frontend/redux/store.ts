import { configureStore } from '@reduxjs/toolkit';
import { chatSlice } from './reducers/chat';
import { authSlice } from './reducers/auth';

// Assign configureStore to a `store` variable
const store = configureStore({
  reducer: {
    [chatSlice.name]: chatSlice.reducer,
    [authSlice.name]: authSlice.reducer,
  },
});

export default store;

// Define RootState type based on the store's state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
