import { createSlice } from "@reduxjs/toolkit";
import { fetchUserData, login, signOut } from "./authThunk";
import { setToken } from "@/utils/HelperFunctions";
// Define the initial state for the auth slice
const initialState = {
    token: null,
    loading: false,
    userData: {},
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
