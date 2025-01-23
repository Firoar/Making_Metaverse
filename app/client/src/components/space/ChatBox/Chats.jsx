import React from "react";
import classes from "./chatBox.module.css";
import ChatContent from "./ChatContent";
import SendChat from "./SendChat";
import { useSelector } from "react-redux";

const Chats = () => {
  const { selectedGroup } = useSelector((state) => state.groups);

  return (
    <div className={classes["chats"]}>
      {selectedGroup && (
        <>
          <ChatContent />
          <SendChat />
        </>
      )}
    </div>
  );
};
export default Chats;
