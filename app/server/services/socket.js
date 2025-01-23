import {
  giveGroupName,
  updateUserSelectedGroup,
  updateUserSocketId,
} from "../utils/db/allDbCalls.js";
import { printErrorInGoodWay } from "../utils/printErrors.js";

export const updateUserSocketService = async (
  socket,
  id,
  isOnline,
  leaving = false
) => {
  try {
    const socketId = isOnline ? socket.id : null;
    let room = await updateUserSocketId(id, isOnline, socketId, leaving);
    console.log("updated socket id of user");
    if (room) {
      return room;
    }
  } catch (error) {
    const message = `There is a error in the server. An error occurred while updating socket state.`;
    printErrorInGoodWay(error);
    socket.emit("internal-server-error", message);

    console.error(`Disconnecting socket due to error: ${socket.id}`);
    socket.disconnect();
  }
};

export const updatedSelectedGroup = async (socket, groupId, userID) => {
  try {
    await updateUserSelectedGroup(groupId, userID);
  } catch (error) {
    const message = `There is a error in the server. An error occurred while updating user selected group.`;
    printErrorInGoodWay(error);
    socket.emit("internal-server-error", message);

    console.error(`Disconnecting socket due to error: ${socket.id}`);
    socket.disconnect();
  }
};

export const giveRoomName = async (socket, groupId) => {
  try {
    const groupName = await giveGroupName(groupId);
    const roomName = `${groupId}-${groupName}-${groupId}`;
    return roomName;
  } catch (error) {
    const message = `There is a error in the server. An error occurred while getting room name`;
    printErrorInGoodWay(error);
    socket.emit("internal-server-error", message);

    console.error(`Disconnecting socket due to error: ${socket.id}`);
    socket.disconnect();
  }
};
