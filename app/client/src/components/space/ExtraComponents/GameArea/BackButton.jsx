import React from "react";
import classes from "./gameArea.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setEnteredPeerVideoChat,
  setEnteredTypingGameArea,
} from "../../../../store/features/groups/groupsSlice";
import {
  setPlayerX,
  setPlayerY,
} from "../../../../store/features/movement/movementSlice";
import { getSocket } from "../../../../services/socketService";

const BackButton = () => {
  const { lastPlayerX, lastPlayerY } = useSelector((state) => state.movement);
  const { selectedGroup } = useSelector((state) => state.groups);
  const dispatch = useDispatch();
  const socket = getSocket();

  const handleClickedBack = () => {
    dispatch(setPlayerX(lastPlayerX));
    dispatch(setPlayerY(lastPlayerY));
    dispatch(setEnteredTypingGameArea(false));

    const data = {
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      posX: lastPlayerX,
      posY: lastPlayerY,
    };
    socket.emit("i-moved", data);
  };

  return (
    <div className={classes["backButton-div"]} onClick={handleClickedBack}>
      Back
    </div>
  );
};
export default BackButton;
