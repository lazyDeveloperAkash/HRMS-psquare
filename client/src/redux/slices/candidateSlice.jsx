import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

// Fetch All
export const fetchCandidates = createAsyncThunk("candidate/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/candidate");
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Create
export const createCandidate = createAsyncThunk("candidate/create", async (formData, thunkAPI) => {
  try {
    const res = await axios.post("/candidate", formData);
    return res.data.data;
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Update
export const updateCandidate = createAsyncThunk(
  "candidate/update",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const res = await axios.patch(`/candidate/${id}`, updateData);
      return res.data.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete
export const deleteCandidate = createAsyncThunk("candidate/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`/candidate/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Slice
const candidateSlice = createSlice({
  name: "candidate",
  initialState: {
    candidates: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCandidates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      })

      // Create
      .addCase(createCandidate.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.isCreating = false;
        state.candidates.unshift(action.payload);
        toast.success("Candidate created!");
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      })

      // Update
      .addCase(updateCandidate.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.candidates = state.candidates.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
        toast.success("Candidate updated!");
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      })

      // Delete
      .addCase(deleteCandidate.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.candidates = state.candidates.filter((c) => c._id !== action.payload);
        toast.success("Candidate deleted!");
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      });
  },
});

export default candidateSlice.reducer;
