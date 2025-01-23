import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClickedAddGroup } from "../../../../store/features/groups/groupsSlice.js";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router";
import classes from "./addNewGroup.module.css";

const AddNewGroup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clickedAddGroup } = useSelector((state) => state.groups);

  const handleExit = () => {
    dispatch(setClickedAddGroup(false));
  };

  const handleNavigation = (path) => {
    handleExit();
    navigate(path);
  };

  if (!clickedAddGroup) return null;

  return (
    <div className={classes["addGroup-div"]}>
      <div className={classes["addGroup-main-div"]}>
        <div className={classes["addGroup-div-exit"]} onClick={handleExit}>
          <RxCross2
            style={{
              width: "100%",
              height: "100%",
              background: "black",
              margin: "0",
            }}
          />
        </div>

        <div className={classes["addGroup-btns-div"]}>
          <button onClick={() => handleNavigation("/choose-group")}>
            Create Group
          </button>
          <button onClick={() => handleNavigation("/join-group")}>
            Join Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewGroup;

/*

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./addNewGroup.module.css";
import { setClickedAddGroup } from "../../../../store/features/groups/groupsSlice.js";
import { RxCross2 } from "react-icons/rx";
import ChooseMap from "../../../main/ChooseMap";
import ColorsOptions from "../../../main/ColorsOptions";
import JoinGroup from "../../../main/JoinGroup";
import { useNavigate } from "react-router";

const AddNewGroup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clickedAddGroup } = useSelector((state) => state.groups);

  const [clickedJoinGrp, setClickedJoinGrp] = useState(false);
  const [clickedCreateGrp, setClickedCreateGrp] = useState(false);
  const [clickedSelectColor, setClickedSelectColor] = useState(false);
  const [colorChoosed, setColorChoosed] = useState(
    "Select a color for your Character"
  );

  const handleCreateGroupBtn = () => {
    handleExit();
    navigate("/choose-group");
  };

  const handleJoinGroupBtn = () => {
    handleExit();
    navigate("/join-group");
  };

  const handleExit = () => {
    dispatch(setClickedAddGroup(false));
  };

  return (
    <div
      className={`${classes["addGroup-div"]} ${
        clickedAddGroup ? "" : classes["hidden"]
      } `}
    >
      <div className={classes["addGroup-main-div"]}>
        <div className={classes["addGroup-div-exit"]} onClick={handleExit}>
          <RxCross2
            style={{ width: "100%", height: "100%", background: "black" }}
          />
        </div>

        {!clickedCreateGrp && !clickedJoinGrp && (
          <>
            <div className={classes["addGroup-btns-div"]}>
              <button onClick={handleCreateGroupBtn}>Create Group</button>
              <button onClick={handleJoinGroupBtn}>Join Group</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddNewGroup;
*/
