import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice.js";
import movementReducer from "./features/movement/movementSlice.js";
import groupsReducer from "./features/groups/groupsSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    movement: movementReducer,
    groups: groupsReducer,
  },
});

export default store;
