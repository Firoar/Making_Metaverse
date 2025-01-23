import React from "react";
import classes from "./chatBox.module.css";
import ChatHeading from "./ChatHeading";
import Chats from "./Chats";

const ChatBox = () => {
  // display chat box

  return (
    <div className={classes["chatBox-div"]}>
      <ChatHeading />
      <Chats />
    </div>
  );
};
export default ChatBox;
