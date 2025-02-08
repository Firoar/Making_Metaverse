import React from "react";
import classes from "./codingContest.module.css";

const ChangeUsernameButton = ({ setChangeUserName, changeUserName }) => {
  if (changeUserName) return null;

  const handleClickedChangeUsername = () => {
    setChangeUserName(true);
  };
  return (
    <div
      className={classes["change-username-btn-div"]}
      onClick={handleClickedChangeUsername}
    >
      Change Username
    </div>
  );
};
export default ChangeUsernameButton;
