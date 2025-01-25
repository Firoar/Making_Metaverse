import React, { useState } from "react";
import classes from "./groupVideoCall.module.css";
import { toggleScreenShare } from "./groupVideoCall.js";

const constraints = {
  audio: false,
  video: true,
};

const SwitchToScreenShare = () => {
  const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);
  const [screenSharingStream, setScreenSharingStream] = useState(null);

  const handleScreenShareToggle = async () => {
    let stream = null; // Declare stream outside the try block
    if (!isScreenSharingActive) {
      try {
        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } catch (error) {
        console.error(
          "Error occurred when trying to get access to screen share stream: ",
          error
        );
      }
      if (stream) {
        console.log("Screen sharing stream:", stream);
        setScreenSharingStream(stream);
        toggleScreenShare(false, stream); // Pass the stream directly
        setIsScreenSharingActive(true);
      }
    } else {
      toggleScreenShare(true); // Stop screen sharing
      setIsScreenSharingActive(false);

      if (screenSharingStream) {
        screenSharingStream.getTracks().forEach((t) => t.stop());
        setScreenSharingStream(null);
      }
    }
  };

  return (
    <div
      className={`${classes["toggleDiv"]} ${
        isScreenSharingActive ? classes["active"] : ""
      }`}
    >
      <img
        src={"switchToScreenSharing.svg"}
        onClick={handleScreenShareToggle}
        alt="Switch to Screen Sharing"
      />
    </div>
  );
};

export default SwitchToScreenShare;
