import { createSlice } from "@reduxjs/toolkit";

// Define user interface with optional properties
interface User {
  username?: string;
  email?: string;
}

// Define initial state with empty user object
const initialState: User = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { username, email } = action.payload;
      // Update state with user information
      state.username = username;
      state.email = email;
    },
    logout(state) {
      // Reset state to empty user object on logout
      state.username = undefined;
      state.email = undefined;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;