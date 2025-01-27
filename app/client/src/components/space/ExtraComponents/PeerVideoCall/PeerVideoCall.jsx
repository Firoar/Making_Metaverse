import React, { useEffect, useState } from "react";
import classes from "./peerVideoCall.module.css";
import SelectSeat from "./SelectSeat";
import CallRoom from "./CallRoom";
import { useSelector } from "react-redux";

const PeerVideoCall = () => {
  const { enteredPeerVideoChat } = useSelector((state) => state.groups);
  const [selectedSeat, setSelectedSeat] = useState(false);
  const [selectedTable, setSelectedTable] = useState({});

  useEffect(() => {
    if (!enteredPeerVideoChat) {
      setSelectedSeat(false);
      setSelectedTable({});
    }
  }, [enteredPeerVideoChat]);
  if (!enteredPeerVideoChat) return null;

  return (
    <div className={classes["peerVideoCall-div"]}>
      {!selectedSeat ? (
        <SelectSeat
          setSelectedSeat={setSelectedSeat}
          setSelectedTable={setSelectedTable}
        />
      ) : (
        <CallRoom selectedTable={selectedTable} />
      )}
    </div>
  );
};
export default PeerVideoCall;
