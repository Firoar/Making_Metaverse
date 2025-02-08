import React, { useEffect, useState } from "react";
import classes from "./contestLeaderBoard.module.css";
import { notify } from "../../../../utils/toasts.js";
import axios from "axios";

const LeaderBoard = ({ info }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!info || info.length === 0) return;

    const fetchUsers = async () => {
      const fetchedData = [];
      const uniqueUsers = new Set();

      const promises = info
        .filter(
          (user) =>
            user.leetCodeUsername && !uniqueUsers.has(user.leetCodeUsername)
        )
        .map(async (user) => {
          uniqueUsers.add(user.leetCodeUsername);
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_LEETCODE_URL}userProfile/${
                user.leetCodeUsername
              }`
            );
            fetchedData.push({
              name: user.username,
              username: user.leetCodeUsername,
              data: response.data,
            });
          } catch (error) {
            notify("Error fetching LeetCode user info", "error");
            console.error(error);
          }
        });

      await Promise.all(promises);

      fetchedData.sort((a, b) => calulateScore(b.data) - calulateScore(a.data));

      setData(fetchedData);
    };

    fetchUsers();
  }, [info]);

  const calulateScore = (scoreData) => {
    return (
      1 * scoreData.easySolved +
      2 * scoreData.mediumSolved +
      3 * scoreData.hardSolved
    );
  };

  return (
    <div className={classes["full-leaderboard"]}>
      <div className={classes["full-leaderboard-title"]}>
        <h2>LeaderBoard</h2>
        <p>
          <span style={{ color: "green" }}>Easy</span> : 1,{"  "}
          <span style={{ color: "orange" }}>Medium</span> : 2,{"  "}
          <span style={{ color: "red" }}>Hard</span>: 3{"  "}
        </p>
      </div>
      <div className={classes["full-leaderboard-points"]}>
        {data.map((user) => (
          <div key={user.username}>
            <p>
              {user.name} ({user.username}) :{" "}
              <span>{calulateScore(user.data)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard;
