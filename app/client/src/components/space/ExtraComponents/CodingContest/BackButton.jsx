import React from "react";
import classes from "./codingContest.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setPlayerX,
  setPlayerY,
} from "../../../../store/features/movement/movementSlice.js";
import { setEnteredLeetcodeArea } from "../../../../store/features/groups/groupsSlice.js";
import { getSocket } from "../../../../services/socketService.js";

const BackButton = () => {
  const socket = getSocket();
  const { lastPlayerX, lastPlayerY } = useSelector((state) => state.movement);
  const { selectedGroup } = useSelector((state) => state.groups);
  const dispatch = useDispatch();
  const handleClickedBack = () => {
    dispatch(setPlayerX(lastPlayerX));
    dispatch(setPlayerY(lastPlayerY));
    dispatch(setEnteredLeetcodeArea(false));

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
