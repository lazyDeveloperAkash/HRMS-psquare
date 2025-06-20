import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import candidateReducer from "./slices/candidateSlice";
import leaveReducer from "./slices/leaveSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidate: candidateReducer,
    leave: leaveReducer,
  },
});
