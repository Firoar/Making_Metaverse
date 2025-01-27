import React, { useState } from "react";
import classes from "./peerVideoCall.module.css";

const TogglePeerVideo = ({ localStream }) => {
  const [isLocalVideoDisabled, setIsLocalVideoDisabled] = useState(false);

  const handleCameraButtonPressed = () => {
    localStream.getVideoTracks()[0].enabled = isLocalVideoDisabled
      ? true
      : false;
    setIsLocalVideoDisabled(!isLocalVideoDisabled);
  };

  return (
    <div className={classes["toggleDiv"]}>
      <img
        src={isLocalVideoDisabled ? "./cameraOff.svg" : "./camera.svg"}
        onClick={handleCameraButtonPressed}
      />
    </div>
  );
};
export default TogglePeerVideo;
