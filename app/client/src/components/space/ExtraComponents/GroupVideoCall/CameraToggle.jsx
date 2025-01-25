import React, { useState } from "react";
import classes from "./groupVideoCall.module.css";
import { toggleCamera } from "./groupVideoCall.js";

const CameraToggle = () => {
  const [isLocalVideoDisabled, setIsLocalVideoDisabled] = useState(false);

  const handleCameraButtonPressed = () => {
    toggleCamera(isLocalVideoDisabled);
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
export default CameraToggle;
