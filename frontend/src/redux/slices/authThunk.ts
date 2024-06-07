import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken, removeToken } from "@/utils/HelperFunctions";
import axios from "axios";

export const fetchUserData = createAsyncThunk("auth/fetchUserData", async (_, { rejectWithValue }) => {
  try {
    const accessToken = getToken();

    const response = await axios.get("http://localhost:8000/api/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { ...response.data.data, accessToken };
  } catch (e) {
    // console.log(e);
    removeToken();
    return rejectWithValue("");
  }
});

export const login = createAsyncThunk("auth/login", async (payload: any) => {
  const response = await axios.post("http://localhost:8000/api/auth/login", payload);
  return response.data.data;
});

export const signOut = createAsyncThunk("auth/signOut", async () => {
  removeToken();

  await axios.put("http://localhost:8000/api/auth/logout", null, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
});
