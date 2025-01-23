import React from "react";
import classes from "./chatBox.module.css";
import { useSelector } from "react-redux";

const ChatHeading = () => {
  const { selectedGroup } = useSelector((state) => state.groups);
  return (
    <div className={classes["chatBox-heading"]}>
      {selectedGroup === null ? "Chats" : selectedGroup.name}
    </div>
  );
};
export default ChatHeading;
