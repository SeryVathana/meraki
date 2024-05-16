import { createAsyncThunk } from "@reduxjs/toolkit";
// import { getToken, removeToken, setToken } from "../../utils/HelperFunctions";
import { getToken,removeToken,setToken } from "@/utils/HelperFunctions";
import axios from "axios";

export const fetchUserData = createAsyncThunk("auth/fetchUserData", async (_, { rejectWithValue }) => {
  try {
    const accessToken = getToken();
    const response = await axios.get("/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { ...response.data, accessToken };
  } catch (e) {
    removeToken();
    return rejectWithValue("");
  }
});

export const login = createAsyncThunk("auth/login", async (payload: any) => {
  const response = await axios.post("http://localhost:3000/auth/admin/login", payload);
  setToken(response.data.data.token);
  return response.data.data;
});

export const signOut = createAsyncThunk("auth/signOut", async () => {
  removeToken();
});