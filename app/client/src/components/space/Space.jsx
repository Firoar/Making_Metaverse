import React, { useEffect, useMemo } from "react";
import Navbar from "./Navbar/Navbar";
import GroupBox from "./GroupBox/GroupBox";
import Map from "./Map/Map";
import ChatBox from "./ChatBox/ChatBox";
import classes from "./space.module.css";
import {
  disconnectSocket,
  initializeSocket,
} from "../../services/socketService.js";
import { useNavigate } from "react-router";
import { handleLogout } from "../../utils/importantFunction.js";
import { ToastContainer } from "react-toastify";
import AddNewGroup from "./ExtraComponents/AddGroup/AddNewGroup.jsx";
import GroupVideoCall from "./ExtraComponents/GroupVideoCall/GroupVideoCall.jsx";
import PeerVideoCall from "./ExtraComponents/PeerVideoCall/PeerVideoCall.jsx";

const Space = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const socket = initializeSocket();

    socket.on("connect", () => {
      console.log("socket connected : ", socket.id);
    });

    socket.on("internal-server-error", (message) => {
      console.log(message);
      alert("Internal server Error");
      handleLogout(navigate);
    });

    return () => disconnectSocket();
  });

  return (
    <div className={classes["space-div"]}>
      <Navbar />
      <div className={classes["space-main-div"]}>
        <GroupBox />
        <Map />
        <ChatBox />
      </div>
      <AddNewGroup />
      <GroupVideoCall />
      <PeerVideoCall />
      <ToastContainer />
    </div>
  );
};
export default Space;
