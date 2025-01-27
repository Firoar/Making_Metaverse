import React, { useEffect } from "react";
import classes from "./map.module.css";
import MapImage from "./MapImage/MapImage";
import PlayerImage from "./PlayerImage/PlayerImage";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../../../services/socketService";
import {
  setGroupIdToGroupName,
  setGroupParticipants,
  setGroupVideoChatSeatsOccupied,
  setPeerDisconnected,
  setPeerVideoChatSeatsOccupied,
} from "../../../store/features/groups/groupsSlice.js";
import ParticipantsImage from "./ParticipantsImage/ParticipantsImage.jsx";
import axios from "axios";
import { notify } from "../../../utils/toasts.js";
import {
  belongInsideGroupVideoChairs,
  belongInsidePeerVideoChairs,
  InGroupVideoChairs,
} from "../../../utils/AllMaps.js";
import { someoneLeftGroupVideoCall } from "../ExtraComponents/GroupVideoCall/groupVideoCall.js";

const Map = () => {
  const socket = getSocket(); // Ensure single socket instance
  const dispatch = useDispatch();
  const {
    selectedGroup,
    groupParticipants,
    groupIdToGroupName,
    groupVideoChatSeatsOccupied,
    peerVideoChatSeatsOccupied,
  } = useSelector((state) => state.groups);
  const { playerX, playerY, mapTop, mapLeft } = useSelector(
    (state) => state.movement
  );
  const setGrpPartcipantsAndIdToName = async (participants) => {
    const idToName = {};
    participants.forEach((p) => {
      if (p) {
        idToName[p.id] = [p.username, p.color];
      }
    });

    dispatch(setGroupIdToGroupName(idToName));
  };

  useEffect(() => {
    if (!selectedGroup || !selectedGroup.myId) return;

    const handleSomeoneJoined = (data) => {
      const dataToSend = {
        roomName: data.roomName,
        myInfo: {
          id: selectedGroup.myId,
          myCharColor: selectedGroup.myCharColor,
          posX: playerX,
          posY: playerY,
        },
      };
      socket.emit("take-my-coordinates", dataToSend);
    };
    const handleSomeoneSentCoordinates = async ({ data }) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}api/id-to-name-and-color`,
          {
            params: {
              groupId: selectedGroup.id,
            },
            withCredentials: true,
          }
        );
        if (response.data.ok) {
          await setGrpPartcipantsAndIdToName(response.data.participants);
        }
      } catch (error) {
        notify("Error while fetching participants", "error");
        console.error(error);
      }

      if (InGroupVideoChairs(data.posY, data.posX)) {
        const newSeatsOccupied = [
          ...groupVideoChatSeatsOccupied,
          [data.posY, data.posX],
        ];
        dispatch(setGroupVideoChatSeatsOccupied(newSeatsOccupied));
      }

      dispatch(
        setGroupParticipants({
          id: data.id,
          coordinates: [data.posX, data.posY],
        })
      );
      if (belongInsidePeerVideoChairs(data.posY, data.posX)) {
        const newSeatsOccupied = [
          ...peerVideoChatSeatsOccupied,
          [data.posY, data.posX],
        ];
        dispatch(setPeerVideoChatSeatsOccupied(newSeatsOccupied));
      }
    };

    const handleSomeoneMoved = (data) => {
      if (InGroupVideoChairs(data.posY, data.posX)) {
        const newSeatsOccupied = [
          ...groupVideoChatSeatsOccupied,
          [data.posY, data.posX],
        ];
        dispatch(setGroupVideoChatSeatsOccupied(newSeatsOccupied));
      }

      dispatch(
        setGroupParticipants({
          id: data.myId,
          coordinates: [data.posX, data.posY],
        })
      );

      if (belongInsidePeerVideoChairs(data.posY, data.posX)) {
        const newSeatsOccupied = [
          ...peerVideoChatSeatsOccupied,
          [data.posY, data.posX],
        ];
        dispatch(setPeerVideoChatSeatsOccupied(newSeatsOccupied));
      }
    };

    const handleSomeoneLeftRoom = (data) => {
      const { userId, socketId } = data;
      const [posX, posY] = groupParticipants[userId] || [];

      if (belongInsideGroupVideoChairs(posY, posX)) {
        const newSeatsOccupied = groupVideoChatSeatsOccupied.filter(
          ([seatX, seatY]) => !(seatX === posY && seatY === posX)
        );
        dispatch(setGroupVideoChatSeatsOccupied(newSeatsOccupied));
      }

      if (belongInsidePeerVideoChairs(posY, posX)) {
        const newSeatsOccupied = peerVideoChatSeatsOccupied.filter(
          ([seatX, seatY]) => !(seatX === posY && seatY === posX)
        );
        dispatch(setGroupVideoChatSeatsOccupied(newSeatsOccupied));
        dispatch(setPeerDisconnected(true));
      }

      dispatch(
        setGroupParticipants({
          id: userId,
          coordinates: null,
        })
      );
      someoneLeftGroupVideoCall({ userId, socketId });
    };

    socket.on("someone-joined", handleSomeoneJoined);
    socket.on("someone-sent-their-coordinates", handleSomeoneSentCoordinates);
    socket.on("someone-moved", handleSomeoneMoved);
    socket.on("someone-left-room", handleSomeoneLeftRoom);

    return () => {
      socket.off("someone-joined", handleSomeoneJoined);
      socket.off(
        "someone-sent-their-coordinates",
        handleSomeoneSentCoordinates
      );
      socket.off("someone-moved", handleSomeoneMoved);
      socket.off("someone-left-room", handleSomeoneLeftRoom);
    };
  }, [selectedGroup, playerX, playerY, groupParticipants, dispatch]);

  return (
    <div className={classes["map-div"]}>
      {selectedGroup && (
        <>
          <MapImage />
          <PlayerImage />
          {Object.entries(groupParticipants).map(([id, coordinates]) => {
            if (!coordinates) return null;
            const participantInfo = groupIdToGroupName?.[id];
            if (!participantInfo) return null;
            const [participantName, participantColor] = participantInfo;

            return (
              <ParticipantsImage
                src={`./${participantColor?.toLowerCase()}-ball.png`}
                pos={coordinates}
                name={participantName}
                mapPos={[mapLeft, mapTop]}
                key={id}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default Map;
