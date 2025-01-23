import React, { useEffect, useRef } from "react";
import classes from "./chatBox.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroupChat } from "../../../store/features/groups/groupsSlice.js";
import SingleChat from "./SingleChat.jsx";
import { getSocket } from "../../../services/socketService.js";

const ChatContent = () => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const { selectedGroup, selectedGroupChat, groupIdToGroupName } = useSelector(
    (state) => state.groups
  );

  // Fetch chat content for the selected group
  const getChatContent = async () => {
    if (!selectedGroup) return;

    const dataToSend = {
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
    };

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/get-chats-of-group`,
        {
          withCredentials: true,
          params: dataToSend,
        }
      );

      if (response.data.ok) {
        dispatch(setSelectedGroupChat(response.data.chats));
      }
    } catch (error) {
      alert(
        `Error fetching chats: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selectedGroup) return;
    getChatContent();

    const handleNewMessage = () => {
      getChatContent();
    };

    socket.on("someone-sent-message", handleNewMessage);

    return () => {
      socket.off("someone-sent-message", handleNewMessage);
    };
  }, [selectedGroup]);

  // Filter chats for the selected group
  const filteredChats = selectedGroupChat.filter(
    (chat) => chat.groupId === selectedGroup.id
  );

  return (
    <div className={classes["chat-content"]}>
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => {
          const userInfo = groupIdToGroupName?.[chat.userId] || [];
          const data = {
            name: userInfo[0] || "Me",
            color:
              userInfo[1]?.toLowerCase() ||
              selectedGroup?.myCharColor?.toLowerCase() ||
              "gray",
            content: chat.content,
            me: chat.userId === selectedGroup.myId,
          };

          return <SingleChat key={chat.id} data={data} />;
        })
      ) : (
        <p>No chats available for this group.</p>
      )}
    </div>
  );
};

export default ChatContent;
