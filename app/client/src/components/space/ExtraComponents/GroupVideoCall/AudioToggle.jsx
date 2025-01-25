import React, { useState } from "react";
import classes from "./groupVideoCall.module.css";
import { toggleMic } from "./groupVideoCall.js";

const AudioToggle = () => {
  const [isMicMuted, setIsMicMuted] = useState(false);

  const handleMicButtonPressed = () => {
    toggleMic(isMicMuted);
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
export default AudioToggle;
