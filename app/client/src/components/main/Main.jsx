import React, { useState } from "react";
import classes from "./MainCss/mainCss.module.css";
import ChooseMap from "./ChooseMap";
import JoinGroup from "./JoinGroup";
import ColorsOptions from "./ColorsOptions";
import { useNavigate } from "react-router";

const Main = () => {
  const navigate = useNavigate();

  const handleCreateGroupBtn = () => {
    navigate("/choose-group");
  };

  const handleJoinGroupBtn = () => {
    navigate("/join-group");
  };

  return (
    <div className={classes["main-div"]}>
      <button onClick={handleCreateGroupBtn}>Create Group</button>
      <button onClick={handleJoinGroupBtn}>Join Group</button>
    </div>
  );
};
export default Main;
