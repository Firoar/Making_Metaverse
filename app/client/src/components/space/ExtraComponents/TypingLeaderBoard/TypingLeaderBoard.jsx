import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./typingLeaderBoard.module.css";
import { notify } from "../../../../utils/toasts.js";
import axios from "axios";
import BackButton from "./BackButton.jsx";
import LeaderBoard from "./LeaderBoard.jsx";

const TypingLeaderBoard = () => {
  const { showTypingLeaderBoard, selectedGroup } = useSelector(
    (state) => state.groups
  );
  const [leaderBoard, setLeaderBoard] = useState([]);

  const fetchTypingScoreBoard = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/get-typing-leaderboard`,
        {
          withCredentials: true,
          params: {
            groupId: selectedGroup.id,
          },
        }
      );
      if (response.data.ok) {
        setLeaderBoard(response.data.particpantsTypingSpeed);
      }
    } catch (error) {
      notify("Error while fetching typing scoreboard", "error");
      console.log(error);
    }
  };

  useEffect(() => {
    if (showTypingLeaderBoard) {
      fetchTypingScoreBoard();
    }
  }, [showTypingLeaderBoard]);

  if (!showTypingLeaderBoard) return null;
  return (
    <div className={classes["typingBoard-div"]}>
      <div className={classes["typingBoard-main"]}>
        <LeaderBoard leaderBoard={leaderBoard} />
        <BackButton />
      </div>
    </div>
  );
};
export default TypingLeaderBoard;
