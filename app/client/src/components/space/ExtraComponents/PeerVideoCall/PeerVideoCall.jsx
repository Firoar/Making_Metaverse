import React, { useEffect, useState } from "react";
import classes from "./peerVideoCall.module.css";
import SelectSeat from "./SelectSeat";
import CallRoom from "./CallRoom";
import { useSelector } from "react-redux";

const PeerVideoCall = () => {
  const { enteredPeerVideoChat } = useSelector((state) => state.groups);
  const [selectedSeat, setSelectedSeat] = useState(false);

  if (!enteredPeerVideoChat) return null;

  return (
    <div className={classes["peerVideoCall-div"]}>
      {!selectedSeat ? (
        <SelectSeat setSelectedSeat={setSelectedSeat} />
      ) : (
        <CallRoom />
      )}
    </div>
  );
};
export default PeerVideoCall;
