import React from "react";
import classes from "./contestLeaderBoard.module.css";
import { useDispatch } from "react-redux";
import { setShowContestLeaderBoard } from "../../../../store/features/groups/groupsSlice.js";

const BackButton = () => {
  const dispatch = useDispatch();
  const handleClickedBack = () => {
    dispatch(setShowContestLeaderBoard(false));
  };
  return (
    <div className={classes["backButton-div"]} onClick={handleClickedBack}>
      Back
    </div>
  );
};
export default BackButton;
