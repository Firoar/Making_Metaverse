import React, { useEffect } from "react";
import classes from "./groupBox.module.css";
import GroupDiv from "./GroupDiv";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllGroups,
  logout as groupLogout,
} from "../../../store/features/groups/groupsSlice.js";
import axios from "axios";
import { getSocket } from "../../../services/socketService.js";

const GroupsDiv = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const { allGroups } = useSelector((state) => state.groups);

  const getAllGroups = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/get-all-user-groups`,
        {
          withCredentials: true,
        }
      );

      if (response.data.ok) {
        const groupsData = response.data.allUserGroups;
        // console.log(groupsData);
        dispatch(setAllGroups(groupsData));
      }
    } catch (error) {
      alert("something went wrong while fetching group data");
      console.log(error);
    }
  };

  useEffect(() => {
    getAllGroups();
    const handleNewGroup = async () => {
      dispatch(groupLogout());
      await getAllGroups();
    };

    socket.on("i-joined-new-group", handleNewGroup);

    return () => {
      socket.off("i-joined-new-group", handleNewGroup);
    };
  }, []);

  return (
    <div className={classes["groupsDiv"]}>
      {allGroups.map((group, index) => {
        return <GroupDiv key={group.name} group={group} />;
      })}
    </div>
  );
};
export default GroupsDiv;
