import axios from "axios";
import { logout as authLogout } from "../store/features/auth/authSlice.js";
import { logout as groupLogout } from "../store/features/groups/groupsSlice.js";
import { logout as movementLogout } from "../store/features/movement/movementSlice.js";
import { disconnectSocket, getSocket } from "../services/socketService.js";

export const handleLogout = async (navigate, dispatch) => {
  try {
    const socket = getSocket();

    socket.emit("leaving-room");

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}api/auth/logout`,
      null,
      {
        withCredentials: true,
      }
    );

    if (response.data.ok) {
      alert("Logged out.");
      dispatch(authLogout());
      dispatch(groupLogout());
      dispatch(movementLogout());
      disconnectSocket();
      navigate("/");
    }
  } catch (error) {
    alert("Error logging out");
    console.error("Error logging out : ", error);
  }
};
