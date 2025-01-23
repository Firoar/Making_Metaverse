import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  username: "",
  authError: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setAuthError: (state, action) => {
      state.authError = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const { setEmail, setPassword, setUsername, setAuthError, logout } =
  authSlice.actions;

export default authSlice.reducer;
