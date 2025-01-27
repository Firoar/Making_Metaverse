import React, { useEffect, useState } from "react";
import classes from "./peerVideoCall.module.css";

const TogglePeerMic = ({ localStream }) => {
  const [isMicMuted, setIsMicMuted] = useState(false);

  const handleMicButtonPressed = () => {
    localStream.getAudioTracks()[0].enabled = isMicMuted ? true : false;
    setIsMicMuted((prev) => !prev);
  };

  return (
    <div className={classes["toggleDiv"]}>
      <img
        src={isMicMuted ? "./micOff.svg" : "./mic.svg"}
        onClick={handleMicButtonPressed}
      />
    </div>
  );
};
export default TogglePeerMic;
