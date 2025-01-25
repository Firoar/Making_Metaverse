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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["groups.groupParticipants"],
      },
    }),
});

export default store;
