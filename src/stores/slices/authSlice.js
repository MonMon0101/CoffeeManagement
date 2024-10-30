import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    error: "",
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },

    setError: (state, { payload }) => {
      state.error = payload;
    },

    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const authActions = authSlice.actions;
export const useAuth = () => useSelector((state) => state.auth);
export default authSlice.reducer;
