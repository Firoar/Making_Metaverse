import React from "react";
import classes from "./groupBox.module.css";
import GroupDiv from "./GroupDiv";
import GroupHeading from "./GroupHeading";
import GroupsDiv from "./GroupsDiv";

const GroupBox = () => {
  // fetch all groups and display

  return (
    <div className={classes["groupBox-div"]}>
      <GroupHeading />
      <GroupsDiv />
    </div>
  );
};
export default GroupBox;
