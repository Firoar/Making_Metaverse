import React from "react";
import classes from "./groupBox.module.css";
import AddGroup from "./AddGroup";

const GroupHeading = () => {
  return (
    <div className={classes["groupHeading"]}>
      <div className={classes["groupHeading-div"]}>
        <h3>Groups</h3>
        <AddGroup />
      </div>
    </div>
  );
};
export default GroupHeading;
