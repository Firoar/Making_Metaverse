import React from "react";
import classes from "./MainCss/chooseMap.module.css";

const InputBox = ({ setGroupName, groupName }) => {
  return (
    <input
      type="text"
      name="group"
      placeholder="Enter Group Name"
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)}
      className={classes["group-input"]}
    />
  );
};
export default InputBox;
