import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
    });
  }
  // console.log("socket intialized");
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket not initialized. Initializing now...");
    return initializeSocket();
  }

  return socket;
};

export const printSocketId = () => {
  if (socket) {
    console.log(socket);
  } else {
    console.error("error no socket id");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    // console.log("Socket disconnected : ");
    socket.disconnect();
    socket = null;
  }
};
