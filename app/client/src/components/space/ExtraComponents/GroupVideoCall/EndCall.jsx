import React from "react";
import classes from "./groupVideoCall.module.css";
import { leaveVideoCall } from "./groupVideoCall.js";

const EndCall = () => {
  const handleEndCall = () => {
    leaveVideoCall();
  };

  return (
    <div onClick={handleEndCall} className={classes["groupVideoCall-endBtn"]}>
      End call
    </div>
  );
};
export default EndCall;
