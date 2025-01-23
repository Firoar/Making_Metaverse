import React from "react";
import Navbar from "../space/Navbar/Navbar";
import GroupBox from "../space/GroupBox/GroupBox";
import Map from "../space/Map/Map";
import ChatBox from "../space/ChatBox/ChatBox";
import classes from "../space/space.module.css";

const TestComponent = () => {
  return (
    <div className={classes["space-div"]}>
      <Navbar />
      <div className={classes["space-main-div"]}>
        <GroupBox />
        <Map />
        <ChatBox />
      </div>
    </div>
  );
};
export default TestComponent;
