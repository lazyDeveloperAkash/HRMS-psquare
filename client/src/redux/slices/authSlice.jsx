import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios"; // you will create axios instance

// register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/register", credentials);
      return res.data;
    } catch (err) {
      console.log(err, "err");
      return rejectWithValue(err.response.data.message || "Signup failed");
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/login", credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Login failed");
    }
  }
);

// Load User on App Start
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/auth/user");
      return res.data;
    } catch (err) {
      return rejectWithValue("Not authenticated");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/auth/logout");
      return res.data;
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      //register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
         state.loading = false;
        state.user = action.payload?.data;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = true;
        state.error = null;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // loadUser
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
