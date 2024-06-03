import { createSlice } from "@reduxjs/toolkit";
import { fetchUserData, login, signOut } from "./authThunk";
import { setToken } from "@/utils/HelperFunctions";

// Define types for user data and login/fetch response
export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  is_following: boolean;
  pf_img_url: string;
  social_login_info: string;
  followers: number[];
  followings: number[];
  created_at: string;
  updated_at: string;
  invites: number;
  group_req: number;
  total_noti: number;
};

// Define the initial state for the auth slice
const initialState = {
  token: null as string | null,
  loading: false,
  userData: {} as User,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.userData = {} as User;
        state.token = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.token = token;
        state.userData = {
          ...user,
          followers: JSON.parse(user.followers).length,
          followings: JSON.parse(user.followings).length,
        };
        state.loading = false;

        // Save token to local storage
        setToken(token);
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        const { accessToken, ...user } = action.payload;
        state.token = accessToken;
        state.userData = {
          ...user,
          followers: JSON.parse(user.followers).length,
          followings: JSON.parse(user.followings).length,
        };
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.loading = false;
      });
  },
});

// No need to destructure actions from authSlice in TypeScript
export default authSlice.reducer;
