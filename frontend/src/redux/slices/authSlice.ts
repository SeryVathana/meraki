import { createSlice } from "@reduxjs/toolkit";

// Define user interface with optional properties
interface User {
  fullname: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
}

// Define initial state with empty user object
const initialState: User = {
  fullname: "Sery Vathana",
  username: "seryvathana",
  email: "yooseryvathana@gmail.com",
  role: "admin",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { fullname, username, email, role }: User = action.payload;
      // Update state with user information
      state.email = fullname;
      state.username = username;
      state.email = email;
      state.role = role;
    },
    logout(state) {
      // Reset state to empty user object on logout
      state.fullname = null;
      state.username = null;
      state.email = null;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
