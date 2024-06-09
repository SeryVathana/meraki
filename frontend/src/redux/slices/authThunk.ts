import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken, removeToken } from "@/utils/HelperFunctions";
import axios from "axios";

export const fetchUserData = createAsyncThunk("auth/fetchUserData", async (_, { rejectWithValue }) => {
  try {
    const accessToken = getToken();

    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.status != 200) {
      removeToken();
      return rejectWithValue("");
    }

    return { ...response.data.data, accessToken };
  } catch (e) {
    // console.log(e);
    // removeToken();
    return rejectWithValue("");
  }
});

export const login = createAsyncThunk("auth/login", async (payload: any) => {
  const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/login`, payload);
  return response.data.data;
});

export const signOut = createAsyncThunk("auth/signOut", async () => {
  removeToken();

  await axios.put(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, null, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
});
