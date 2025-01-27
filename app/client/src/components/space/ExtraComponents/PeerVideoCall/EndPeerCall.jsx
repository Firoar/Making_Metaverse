import React from "react";
import classes from "./peerVideoCall.module.css";

export default function EndPeerCall({ handleEndCall }) {
  const handleEndCallClicked = () => {
    handleEndCall();
  };

  return (
    <div
      onClick={handleEndCallClicked}
      className={classes["peerVideoCall-endBtn"]}
    >
      End call
    </div>
  );
}
