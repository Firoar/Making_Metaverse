import React, { useEffect } from "react";
import classes from "./peerVideoCall.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../../../../services/socketService";
import { setPeerVideoChatSeatsOccupied } from "../../../../store/features/groups/groupsSlice.js";
import {
  setPlayerX,
  setPlayerY,
} from "../../../../store/features/movement/movementSlice";

const ColorBall = (props) => {
  return (
    <div
      className={`${classes["color-ball"]} ${
        props.left ? classes["left-side"] : classes["right-side"]
      }`}
    >
      <div
        className={classes["ball-div"]}
        style={{ background: `${props.jod.user[1].toLowerCase()}` }}
      ></div>
      {/* <p>{props.jod.user[0]}</p> */}
      <span>{props.jod.user[0]}</span>
    </div>
  );
};

const Table = ({ table, setSelectedSeat }) => {
  const { peerVideoChatSeatsOccupied, selectedGroup } = useSelector(
    (state) => state.groups
  );
  const dispatch = useDispatch();
  const socket = getSocket();
  const bothOccupied = table.left.isOccupied && table.right.isOccupied;

  const handleSeatClick = (seat) => {
    const updatedPeerOccupiedSeats = [...peerVideoChatSeatsOccupied, seat];
    dispatch(setPeerVideoChatSeatsOccupied(updatedPeerOccupiedSeats));
    dispatch(setPlayerX(seat[1]));
    dispatch(setPlayerY(seat[0]));

    const data = {
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      posX: seat[1],
      posY: seat[0],
    };
    socket.emit("i-moved", data);
  };

  const handleClicked = () => {
    if (!table.left.isOccupied) {
      handleSeatClick(table.left.seat);
    } else if (!table.right.isOccupied) {
      handleSeatClick(table.right.seat);
    }
    setSelectedSeat(true);
  };

  useEffect(() => {
    console.log(table);
  }, []);

  return (
    <div
      className={`${classes["table-div"]} ${
        bothOccupied ? classes["bothOccupied"] : ""
      }`}
      onClick={bothOccupied ? null : handleClicked}
    >
      {table.left.isOccupied && <ColorBall jod={table.left} left={true} />}
      <p>Table - {table.id}</p>
      {table.right.isOccupied && <ColorBall jod={table.right} left={false} />}
    </div>
  );
};

export default Table;
