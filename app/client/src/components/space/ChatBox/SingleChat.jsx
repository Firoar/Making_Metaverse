import React from "react";
import classes from "./chatBox.module.css";

const SingleChat = ({ data }) => {
  return (
    <div className={`${classes["single-chat-div"]} ${data.me && "me"}`}>
      <div
        className={classes["single-chat-heading"]}
        style={{ color: `${data.color}` }}
      >
        {data.name}
      </div>
      <div className={classes["single-chat-content"]}>{data.content}</div>
    </div>
  );
};
export default SingleChat;
