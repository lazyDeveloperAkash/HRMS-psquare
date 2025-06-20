import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

// Fetch All
export const fetchLeaves = createAsyncThunk("leave/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/leave");
    return res.data.data;
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Create
export const createLeave = createAsyncThunk("leave/create", async (formData, thunkAPI) => {
  try {
    const res = await axios.post("/leave", formData);
    return res.data.data;
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Update Status only
export const updateLeaveStatus = createAsyncThunk(
  "leave/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await axios.patch(`/leave/${id}/status`, { status });
      console.log(res.data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    leaves: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    error: null,
  },
  reducers: {
    leaveReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchLeaves.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaves = action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      })

      // Create
      .addCase(createLeave.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.isCreating = false;
        state.leaves.push(action.payload);
        toast.success("Leave created!");
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      })

      // Update Status
      .addCase(updateLeaveStatus.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.leaves = state.leaves.map((l) =>
          l._id === action.payload._id ? action.payload : l
        );
        toast.success("Leave status updated!");
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      });
  },
});

export const { leaveReset } = leaveSlice.actions;

export default leaveSlice.reducer;
