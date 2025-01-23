import React, { useEffect } from "react";
import classes from "./groupVideoCall.module.css";
import { useSelector } from "react-redux";
import {
  handleConnInit,
  handleConnPrepare,
  handleSignalingData,
  testingBro,
} from "./groupVideoCall.js";
import { getSocket } from "../../../../services/socketService.js";

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
      testingBro(groupVideoChatSeatsOccupied);

      return () => {
        socket.off("conn-prepare", handleConnPrepare);
        socket.off("conn-init", handleConnPrepare);
        socket.off("conn-signal", handleSignalingData);
      };
    }
  }, [enteredGroupVideoChat]);

  if (!enteredGroupVideoChat) return null;

  return (
    <div className={classes["groupVideoCall-div"]}>
      <div
        className={`${classes["groupVideoCall-mainDiv"]} groupVideoCall-mainDiv`}
      >
        {}
      </div>
      <div className={classes["groupVideoCall-buttonsDiv"]}>
        <button className={classes["groupVideoCall-endBtn"]}>End call</button>
      </div>
    </div>
  );
};
export default GroupVideoCall;
