import React from "react";
import classes from "./groupBox.module.css";
import InviteFriendsComponent from "./InviteFriendsComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedGroup,
  setGroupParticipants,
  setGroupIdToGroupName,
} from "../../../store/features/groups/groupsSlice.js";
import {
  setPlayerX,
  setPlayerY,
} from "../../../store/features/movement/movementSlice.js";
import {
  randomSpawn,
  setPlayerName,
} from "../../../store/features/movement/movementSlice.js";
import { getSocket } from "../../../services/socketService.js";

export const setGrpPartcipantsAndIdToName = (participants, dispatch) => {
  const newObj = {};
  const idToName = {};
  participants.forEach((p) => {
    if (p) {
      newObj[p.id] = p.info;
      idToName[p.id] = [p.username, p.color];
    }
  });

  dispatch(setGroupParticipants(newObj));
  dispatch(setGroupIdToGroupName(idToName));
};
const GroupDiv = ({ group }) => {
  const dispatch = useDispatch();
  const { selectedGroup } = useSelector((state) => state.groups);

  const socket = getSocket();

  const handleJoinGroup = async () => {
    console.log("joining......................");

    socket.emit("join-group", {
      groupId: group.id,
      groupName: group.name,
    });
  };

  const handleClickedGroup = () => {
    socket.emit("clicked-group", {
      groupId: group.id,
    });

    const { participants, ...groupData } = group;

    // Dispatch selected group details
    const randomSpawnCoor = randomSpawn();
    dispatch(setPlayerX(randomSpawnCoor[0]));
    dispatch(setPlayerY(randomSpawnCoor[1]));

    dispatch(setSelectedGroup(groupData));
    dispatch(setPlayerName(group.myName));

    const newObj = {};
    const idToName = {};
    participants.forEach((p) => {
      if (p) {
        newObj[p.id] = p.info;
        idToName[p.id] = [p.username, p.color];
      }
    });

    dispatch(setGroupParticipants(newObj));
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
