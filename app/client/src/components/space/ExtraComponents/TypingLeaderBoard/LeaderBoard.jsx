import React from "react";
import classes from "./typingLeaderBoard.module.css";

const LeaderBoard = ({ leaderBoard }) => {
  const sortedLeaderBoard = leaderBoard.slice().sort((a, b) => {
    if (a.typingSpeed === null) return 1;
    if (b.typingSpeed === null) return -1;
    return b.typingSpeed - a.typingSpeed;
  });

  return (
    <div className={classes["leaderboard-div"]}>
      <h2>LeaderBoard</h2>
      <ul>
        {sortedLeaderBoard.length > 0 &&
          sortedLeaderBoard.map((obj) => {
            return (
              <li key={obj.username}>
                {obj.username} :{" "}
                {obj.typingSpeed === null ? "-" : obj.typingSpeed}
              </li>
            );
          })}
      </ul>
    </div>
  );
};
export default LeaderBoard;
