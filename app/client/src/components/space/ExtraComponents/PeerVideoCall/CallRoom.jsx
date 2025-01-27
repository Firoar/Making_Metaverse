import React, { useEffect, useRef, useState } from "react";
import classes from "./peerVideoCall.module.css";
import EndPeerCall from "./EndPeerCall";
import TogglePeerMic from "./TogglePeerMic";
import Peer from "simple-peer";
import TogglePeerVideo from "./TogglePeerVideo";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../../../../services/socketService.js";
import { getConfiguration } from "../GroupVideoCall/groupVideoCall.js";
import {
  setPlayerX,
  setPlayerY,
} from "../../../../store/features/movement/movementSlice.js";
import {
  setEnteredPeerVideoChat,
  setPeerDisconnected,
  setPeerVideoChatSeatsOccupied,
} from "../../../../store/features/groups/groupsSlice.js";
import { peerVideoChairs } from "../../../../assets/AllMaps.js";

const defaultConstraints = {
  audio: true,
  video: {
    width: "480",
    height: "360",
  },
};

const CallRoom = ({ selectedTable }) => {
  const {
    selectedGroup,
    groupIdToGroupName,
    peerVideoChatSeatsOccupied,
    groupParticipants,
    peerDisconnected,
  } = useSelector((state) => state.groups);

  const { lastPlayerX, lastPlayerY, playerX, playerY } = useSelector(
    (state) => state.movement
  );
  const dispatch = useDispatch();
  const [otherPersonName, setOtherPersonName] = useState(
    "Waiting for other person to join..."
  );
  const socket = getSocket();
  const [localStream, setLocalStream] = useState(null);
  const localRef = useRef(null);
  const otherRef = useRef(null);
  const peerRef = useRef(null);
  const connectionRef = useRef(null);

  const getMyVideo = async (selectedTable) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        defaultConstraints
      );
      setLocalStream(stream);
      if (localRef.current) {
        localRef.current.srcObject = stream;
        localRef.current.muted = false;
        localRef.current.autoplay = true;
      }

      const data = {
        groupId: selectedGroup.id,
        groupName: selectedGroup.name,
        userId: selectedGroup.myId,
        tableId: selectedTable.id,
      };

      if (selectedTable.members === 1) {
        // create the room
        socket.emit("create-peer-video-room", data);
      } else {
        // join the room
        socket.emit("join-peer-video-room", data);
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const removeMyChair = () => {
    const updatedOccupiedChairs = peerVideoChatSeatsOccupied.filter(
      (chair) => !(chair[0] === playerY && chair[1] === playerX)
    );
    dispatch(setPeerVideoChatSeatsOccupied(updatedOccupiedChairs));
  };
  const handleEndCall = () => {
    removeMyChair();
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    dispatch(setPlayerX(lastPlayerX));
    dispatch(setPlayerY(lastPlayerY));
    dispatch(setEnteredPeerVideoChat(false));

    socket.emit("i-ended-peer-call", {
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      userId: selectedGroup.myId,
      tableId: selectedTable.id,
    });

    socket.emit("i-moved", {
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      posX: lastPlayerX,
      posY: lastPlayerY,
    });
  };

  const getHisName = (userId) => {
    setOtherPersonName(groupIdToGroupName[userId][0]);
  };
  const prepareNewPeerConnection = (isInitiator, peerRoomSocketId) => {
    if (!localStream) {
      return;
    }

    const configuration = getConfiguration();

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    const peer = new Peer({
      initiator: isInitiator,
      stream: localStream,
      config: configuration,
    });

    peer.on("stream", (stream) => {
      if (otherRef.current) {
        otherRef.current.srcObject = stream;
        otherRef.current.muted = false;
        otherRef.current.autoplay = true;
      }
    });

    peer.on("signal", (data) => {
      const signalData = {
        signal: data,
        peerRoomSocketId: peerRoomSocketId,
      };
      socket.emit("peer-conn-signal", signalData);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
      peerRef.current = null;
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    });

    peerRef.current = peer;
  };

  useEffect(() => {
    if (selectedTable) {
      getMyVideo(selectedTable);

      return () => {
        if (peerRef.current) {
          peerRef.current.destroy();
          peerRef.current = null;
        }
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [selectedTable]);

  useEffect(() => {
    if (!localStream) {
      return;
    }
    const handlePeerConnPrepare = (data) => {
      const { peerRoomSocketId, peerUserId } = data;
      getHisName(peerUserId);
      prepareNewPeerConnection(false, peerRoomSocketId);
      socket.emit("peer-conn-init", { peerRoomSocketId: peerRoomSocketId });
    };
    const handlePeerConnInit = (data) => {
      const { peerRoomSocketId, peerUserId } = data;
      getHisName(peerUserId);
      prepareNewPeerConnection(true, peerRoomSocketId);
    };
    const handlePeerConnSignal = (data) => {
      if (peerRef.current && !peerDisconnected) {
        peerRef.current.signal(data.signal);
      }
    };
    const handleSomeoneLeft = (data) => {
      const { userId } = data;
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }

      setOtherPersonName("Waiting for other person to join...");
      const updatedPeerSeats = peerVideoChatSeatsOccupied.filter(
        (chair) =>
          !(
            chair[0] === groupParticipants[userId][1] &&
            chair[1] === groupParticipants[userId][0]
          )
      );
      dispatch(setPeerVideoChatSeatsOccupied(updatedPeerSeats));
    };

    socket.on("peer-conn-prepare", handlePeerConnPrepare);
    socket.on("peer-conn-init", handlePeerConnInit);
    socket.on("peer-conn-signal", handlePeerConnSignal);
    socket.on("someone-left-peer-call", handleSomeoneLeft);

    return () => {
      socket.off("peer-conn-prepare", handlePeerConnPrepare);
      socket.off("peer-conn-init", handlePeerConnInit);
      socket.off("peer-conn-signal", handlePeerConnSignal);
      socket.off("someone-left-peer-call", handleSomeoneLeft);
    };
  }, [localStream]);

  useEffect(() => {
    if (peerDisconnected) {
      console.log("destroying");
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      setOtherPersonName("Waiting for other person to join...");
      dispatch(setPeerDisconnected(false));
    }
  }, [peerDisconnected]);

  return (
    <>
      <div className={classes["video-room"]}>
        <div className={classes["video-div"]}>
          <video ref={localRef} />
          <span>Me</span>
        </div>
        <div className={classes["video-div"]}>
          <video ref={otherRef} />
          <span>{otherPersonName}</span>
        </div>
      </div>
      <div className={classes["video-btns"]}>
        <TogglePeerMic localStream={localStream} />
        <EndPeerCall handleEndCall={handleEndCall} />
        <TogglePeerVideo localStream={localStream} />
      </div>
    </>
  );
};
export default CallRoom;
