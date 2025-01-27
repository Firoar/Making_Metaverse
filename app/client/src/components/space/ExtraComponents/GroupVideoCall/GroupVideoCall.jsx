import React, { useEffect } from "react";
import classes from "./groupVideoCall.module.css";
import { useSelector } from "react-redux";
import {
  handleConnInit,
  handleConnPrepare,
  handleSignalingData,
  someoneLeftGroupVideoCall,
  testingBro,
} from "./groupVideoCall.js";
import { getSocket } from "../../../../services/socketService.js";
import AudioToggle from "./AudioToggle.jsx";
import CameraToggle from "./CameraToggle.jsx";
import EndCall from "./EndCall.jsx";
import SwitchToScreenShare from "./SwitchToScreenShare.jsx";

const GroupVideoCall = () => {
  const { enteredGroupVideoChat, groupVideoChatSeatsOccupied } = useSelector(
    (state) => state.groups
  );

  useEffect(() => {
    if (enteredGroupVideoChat) {
      const socket = getSocket();

      socket.on("conn-prepare", handleConnPrepare);
      socket.on("conn-init", handleConnInit); // now the the people who already joined before me send me con -init in response to my conn-prepare
      socket.on("conn-signal", handleSignalingData);
      socket.on("someone-left-group-video-chat", someoneLeftGroupVideoCall);
      testingBro(groupVideoChatSeatsOccupied);

      return () => {
        socket.off("conn-prepare", handleConnPrepare);
        socket.off("conn-init", handleConnInit);
        socket.off("conn-signal", handleSignalingData);
        socket.off("someone-left-group-video-chat", someoneLeftGroupVideoCall);
      };
    }
  }, [enteredGroupVideoChat]);

  if (!enteredGroupVideoChat) return null;

  return (
    <div className={classes["groupVideoCall-div"]}>
      <div
        className={`${classes["groupVideoCall-mainDiv"]} groupVideoCall-mainDiv`}
      ></div>
      <div className={classes["groupVideoCall-buttonsDiv"]}>
        <AudioToggle />
        <CameraToggle />
        <EndCall />
        <SwitchToScreenShare />
      </div>
    </div>
  );
};
export default GroupVideoCall;
