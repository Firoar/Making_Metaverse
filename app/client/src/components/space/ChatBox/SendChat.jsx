import React, { useState } from "react";
import classes from "./chatBox.module.css";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroupChat } from "../../../store/features/groups/groupsSlice.js";
import { getSocket } from "../../../services/socketService.js";

const SendChat = () => {
  const dispatch = useDispatch();
  const socket = getSocket();

  const [content, setContent] = useState("");
  const { selectedGroup, selectedGroupChat } = useSelector(
    (state) => state.groups
  );

  const handleSendChat = async () => {
    if (!content || content.trim() === "" || !selectedGroup) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}api/send-chat-to-group`,
        {
          chat: content,
          groupId: selectedGroup.id,
          userId: selectedGroup.myId,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.ok) {
        socket.emit("i-sent-message", {
          groupId: selectedGroup.id,
          groupName: selectedGroup.name,
        });
      }
    } catch (error) {
      alert("error while sending chat");
      console.log(error);
    } finally {
      setContent("");
    }
  };

  return (
    <div className={classes["send-chat"]}>
      <div className={classes["send-chat-text-area-div"]}>
        <textarea
          className={classes["send-chat-text-area"]}
          name="content"
          value={content}
          spellCheck={false}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className={classes["send-chat-btn"]} onClick={handleSendChat}>
        <IoSend style={{ width: "50%", height: "50%" }} />
      </div>
    </div>
  );
};
export default SendChat;
