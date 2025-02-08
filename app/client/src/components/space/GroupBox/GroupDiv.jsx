import React from "react";
import classes from "./groupBox.module.css";
import InviteFriendsComponent from "./InviteFriendsComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedGroup,
  setAllGroupParticipants,
  setGroupIdToGroupName,
} from "../../../store/features/groups/groupsSlice.js";
import {
  setPlayerLeetcodeUsername,
  setPlayerX,
  setPlayerY,
} from "../../../store/features/movement/movementSlice.js";
import {
  randomSpawn,
  setPlayerName,
} from "../../../store/features/movement/movementSlice.js";
import { getSocket } from "../../../services/socketService.js";

const GroupDiv = ({ group }) => {
  const dispatch = useDispatch();
  const { selectedGroup } = useSelector((state) => state.groups);
  const { playerLeetcodeUsername } = useSelector((state) => state.movement);

  const socket = getSocket();

  const handleJoinGroup = async () => {
    socket.emit("join-group", {
      groupId: group.id,
      groupName: group.name,
    });
  };

  const handleClickedGroup = () => {
    socket.emit("clicked-group", {
      groupId: group.id,
    });

    const { participants, myLeetCodeUsername, ...groupData } = group;

    const randomSpawnCoor = randomSpawn();
    dispatch(setPlayerX(randomSpawnCoor[0]));
    dispatch(setPlayerY(randomSpawnCoor[1]));

    dispatch(setSelectedGroup(groupData));
    dispatch(setPlayerName(group.myName));
    if (playerLeetcodeUsername === "" && myLeetCodeUsername !== null) {
      dispatch(setPlayerLeetcodeUsername(myLeetCodeUsername));
    }

    const newObj = {};
    const idToName = {};
    participants.forEach((p) => {
      if (p) {
        newObj[p.id] = p.info;
        idToName[p.id] = [p.username, p.color];
      }
    });
    dispatch(setAllGroupParticipants(newObj));
    dispatch(setGroupIdToGroupName(idToName));

    // Join the group
    handleJoinGroup();
  };

  return (
    <div
      className={classes["groupDiv"]}
      onClick={handleClickedGroup}
      style={{
        background: `${
          selectedGroup && selectedGroup.id === group.id ? "#b3cccc" : ""
        }`,
      }}
    >
      <p className={classes["groupDiv-groupName"]}>{group.name}</p>
      {group.isOwner && <InviteFriendsComponent group={group} />}
    </div>
  );
};

export default GroupDiv;
