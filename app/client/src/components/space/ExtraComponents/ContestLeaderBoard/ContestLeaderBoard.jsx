import React, { useEffect, useState } from "react";
import classes from "./contestLeaderBoard.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import BackButton from "./BackButton";
import { notify } from "../../../../utils/toasts.js";
import LeaderBoard from "./LeaderBoard.jsx";

const ContestLeaderBoard = () => {
  const [leetcodeUsername, setLeetcodeUsernames] = useState(null);
  const { showContestLeaderBoard, selectedGroup } = useSelector(
    (state) => state.groups
  );

  const fetchLeetCodeUserNames = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }api/get-all-groups-user-leetcodeUsername`,
        {
          params: {
            groupId: selectedGroup.id,
          },
          withCredentials: true,
        }
      );
      if (response.data.ok) {
        setLeetcodeUsernames(response.data.participantsLeetCodeUserNames);
      }
    } catch (error) {
      notify("Error fetching leetcode info...", "error");
      console.log(error);
    }
  };

  useEffect(() => {
    if (showContestLeaderBoard) {
      fetchLeetCodeUserNames();
    }
  }, [showContestLeaderBoard]);

  if (!showContestLeaderBoard) return null;
  return (
    <div className={classes["contestLeaderBoard-div"]}>
      <div className={classes["contestLeaderBoard-main"]}>
        <LeaderBoard info={leetcodeUsername} />
        <BackButton />
      </div>
    </div>
  );
};
export default ContestLeaderBoard;
