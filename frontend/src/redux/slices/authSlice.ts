import { createSlice } from "@reduxjs/toolkit";
import { login, signOut } from "./authThunk";

// Define types for user data and login/fetch response
interface User {
  // Add specific properties based on your user data structure
  [key: string]: any;
}

// Define the initial state for the auth slice
const initialState = {
  token: null as string | null,
  loading: false,
  userData: {
    email: "jingli130604@gmail.com",
    role:'admin'
  } as User,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.userData = {};
        state.token = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.token = token;
        state.userData = user;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      });
  },
});

// No need to destructure actions from authSlice in TypeScript
export default authSlice.reducer;