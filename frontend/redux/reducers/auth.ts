import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { User } from "@/types";

interface AuthState {
    user: User;
    isAdmin: boolean;
    loader: boolean;
    status: 'idle' | 'loading' | 'failed'| 'succeeded';
    error: string  | undefined;
}

const initialState:AuthState = {
    user: {
        id: undefined,
        name: undefined,
        username: undefined,
        bio: undefined,
        image: undefined,
    },
    isAdmin: false,
    loader: true,
    status: 'idle',
    error: undefined  ,
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await axios.get('http://localhost:5000/userapi/userDetails', { withCredentials: true });
    return response.data;
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userExists: (state, action) => {
            state.user = action.payload;
            state.loader = false;
        },
        userNotExists: (state) => {
            state.user = {
                id: undefined,
                name: undefined,
                username: undefined,
                bio: undefined,
                image: undefined,
            };
            state.loader = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.status = 'loading'
        }).addCase(fetchUser.fulfilled, (state,action) => {
            state.status = 'succeeded';
            state.user = action.payload;
        }).addCase(fetchUser.rejected,(state,action,)=>{
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export const { userExists, userNotExists } = authSlice.actions;
export const selectUser = (state:RootState) => state.auth.user;
export default authSlice.reducer;