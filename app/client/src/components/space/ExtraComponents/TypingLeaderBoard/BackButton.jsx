import React from "react";
import classes from "./typingLeaderBoard.module.css";
import { useDispatch } from "react-redux";
import { setShowTypingLeaderBoard } from "../../../../store/features/groups/groupsSlice.js";

const BackButton = () => {
  const dispatch = useDispatch();
  const handleClickedBack = () => {
    dispatch(setShowTypingLeaderBoard(false));
  };
  return (
    <div className={classes["backButton-div"]} onClick={handleClickedBack}>
      Back
    </div>
  );
};
export default BackButton;
