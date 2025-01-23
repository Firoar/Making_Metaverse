import React, { useEffect } from "react";
import classes from "./map.module.css";
import MapImage from "./MapImage/MapImage";
import PlayerImage from "./PlayerImage/PlayerImage";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../../../services/socketService";
import {
  setGroupParticipants,
  setGroupVideoChatSeatsOccupied,
} from "../../../store/features/groups/groupsSlice.js";
import ParticipantsImage from "./ParticipantsImage/ParticipantsImage.jsx";
import axios from "axios";
import { setGrpPartcipantsAndIdToName } from "../GroupBox/GroupDiv.jsx";
import { notify } from "../../../utils/toasts.js";
import {
  belongInsideGroupVideoChairs,
  InGroupVideoChairs,
} from "../../../utils/AllMaps.js";

const Map = () => {
  const socket = getSocket(); // Ensure single socket instance
  const dispatch = useDispatch();
  const {
    selectedGroup,
    groupParticipants,
    groupIdToGroupName,
    groupVideoChatSeatsOccupied,
  } = useSelector((state) => state.groups);
  const { playerX, playerY, mapTop, mapLeft } = useSelector(
    (state) => state.movement
  );

  useEffect(() => {
    if (!selectedGroup || !selectedGroup.myId) return;

    const handleSomeoneJoined = (data) => {
      console.log("someone-joinedsdddddddd", data);

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
      console.log("someone sent their coorc : ", data);

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
          setGrpPartcipantsAndIdToName(response.data.participants, dispatch);
        }
      } catch (error) {
        // alert("Error!!!!");
        notify("error while fetcging participants", "error");
        console.log(error);
      }
      console.log(
        data.posY,
        data.posX,
        InGroupVideoChairs(data.posY, data.posX)
      );
      if (InGroupVideoChairs(data.posY, data.posX)) {
        console.log("yes-broo..........");

        const newSeatsOccupied = [
          ...groupVideoChatSeatsOccupied,
          [data.posY, data.posX],
        ];

        dispatch(setGroupVideoChatSeatsOccupied(newSeatsOccupied));
      }

      const updatedParticipants = {
        ...groupParticipants,
        [data.id]: [data.posX, data.posY],
      };
      dispatch(setGroupParticipants(updatedParticipants));
    };

    const handleSomeoneMoved = (data) => {
      if (InGroupVideoChairs(data.posY, data.posX)) {
        const newSeatsOccupied = [
          ...groupVideoChatSeatsOccupied,
          [data.posY, data.posX],
        ];
        dispatch(setGroupVideoChatSeatsOccupied(newSeatsOccupied));
      }

      const updatedParticipants = {
        ...groupParticipants,
        [data.myId]: [data.posX, data.posY],
      };
      dispatch(setGroupParticipants(updatedParticipants));
    };

    const handleSomeoneLeftRoom = (data) => {
      const updatedParticipants = { ...groupParticipants };
      const [posX, posY] = updatedParticipants[data.userId];
      if (belongInsideGroupVideoChairs(posY, posX)) {
        const newSeatsOccupied = groupVideoChatSeatsOccupied.filter(
          (arr) => !(arr[0] === posY && arr[1] === posX)
        );

        dispatch(setGroupVideoChatSeatsOccupied(newSeatsOccupied));

        //TODO delete from pairs also
      }

      delete updatedParticipants[data.userId];

      dispatch(setGroupParticipants(updatedParticipants));
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
