import store from "../../../../store/store.js";
import Peer from "simple-peer";
import {
  displayGrid,
  hideScrollBar,
  nameSpanCss,
  videoDivCss,
  videoEleCss,
} from "./jsCss.js";
import { getSocket } from "../../../../services/socketService.js";
import {
  setEnteredGroupVideoChat,
  setGroupVideoChatSeatsOccupied,
} from "../../../../store/features/groups/groupsSlice.js";

let localStream;
let peers = {};
let streams = [];
const addedUsers = new Set();
let toggleFullScreen = null;

const defaultConstraints = {
  audio: true,
  video: {
    width: "480",
    height: "360",
  },
};
export const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
};

export const testingBro = (groupVideoChatSeatsOccupied) => {
  const groupVideoCallMainDiv = document.querySelector(
    ".groupVideoCall-mainDiv"
  );
  hideScrollBar(groupVideoCallMainDiv);

  while (groupVideoCallMainDiv.firstChild) {
    groupVideoCallMainDiv.removeChild(groupVideoCallMainDiv.firstChild);
  }
  getLocalPreviewInitRoomConnection(groupVideoChatSeatsOccupied);
  Object.assign(groupVideoCallMainDiv.style, displayGrid);
};

const getLocalPreviewInitRoomConnection = (groupVideoChatSeatsOccupied) => {
  const socket = getSocket();
  const groupState = store.getState().groups;
  navigator.mediaDevices.getUserMedia(defaultConstraints).then((stream) => {
    localStream = stream;
    showLocalPreview(localStream);

    if (groupVideoChatSeatsOccupied.length - 1 === 0) {
      // create room
      socket.emit("create-group-video-room", {
        myId: groupState.selectedGroup.myId,
        groupId: groupState.selectedGroup.id,
        groupName: groupState.selectedGroup.name,
      });
    } else {
      const participantsIds = Object.keys(groupState.groupParticipants)
        .filter((key) => {
          const seat = groupState.groupParticipants[key];
          if (seat) {
            const seatOccupied = groupState.groupVideoChatSeatsOccupied.some(
              (st) => seat[0] === st[1] && seat[1] === st[0]
            );

            return seatOccupied;
          }
          return false;
        })
        .filter((id) => id !== groupState.selectedGroup.myId); // Exclude the current user's ID

      // join room
      socket.emit("join-group-video-room", {
        myId: groupState.selectedGroup.myId,
        groupId: groupState.selectedGroup.id,
        groupName: groupState.selectedGroup.name,
        participantsIds: participantsIds,
      });
    }
  });
};

export const showLocalPreview = (stream) => {
  const groupState = store.getState().groups;

  const groupVideoCallMainDiv = document.querySelector(
    ".groupVideoCall-mainDiv"
  );
  const hasLocalUserVideo =
    groupVideoCallMainDiv.querySelector(".local-user-video");
  if (hasLocalUserVideo) return;

  const div = document.createElement("div");
  div.id = groupState.selectedGroup.myName;
  div.classList.add("local-user-video");

  const span = document.createElement("span");
  span.textContent = `You`;
  Object.assign(span.style, nameSpanCss);

  Object.assign(div.style, videoDivCss);

  toggleFullScreen = () => {
    if (div.classList.contains("fullScreen")) {
      div.classList.remove("fullScreen");
    } else {
      div.classList.add("fullScreen");
    }
  };

  div.addEventListener("click", toggleFullScreen);
  const videoEle = document.createElement("video");
  videoEle.autoplay = true;
  videoEle.muted = false;
  videoEle.srcObject = stream;

  videoEle.onloadedmetadata = () => {
    videoEle.play();
  };

  Object.assign(videoEle.style, videoEleCss);

  div.appendChild(videoEle);
  div.appendChild(span);
  groupVideoCallMainDiv.appendChild(div);
};

const showOtherPreview = (stream, otherUser) => {
  if (!stream || !(stream instanceof MediaStream)) {
    console.error("Invalid MediaStream provided:", stream);
    return;
  }

  if (addedUsers.has(otherUser[0])) {
    return;
  }

  addedUsers.add(otherUser[0]);

  const groupVideoCallMainDiv = document.querySelector(
    ".groupVideoCall-mainDiv"
  );
  if (!groupVideoCallMainDiv) {
    console.error("Group video call container not found!");
    return;
  }

  const div = document.createElement("div");
  div.id = otherUser[0];
  div.classList.add("other-user", otherUser[0]);

  const span = document.createElement("span");
  span.textContent = `${otherUser[0]}`;
  span.classList.add("user-name");
  Object.assign(span.style, nameSpanCss);
  Object.assign(div.style, videoDivCss);

  toggleFullScreen = () => {
    if (div.classList.contains("fullScreen")) {
      div.classList.remove("fullScreen");
    } else {
      div.classList.add("fullScreen");
    }
  };
  div.addEventListener("click", toggleFullScreen);

  const videoEle = document.createElement("video");
  videoEle.autoplay = true;
  videoEle.muted = false;
  videoEle.srcObject = stream;

  videoEle.onloadedmetadata = () => {
    videoEle.play();
  };
  videoEle.classList.add("other-user-video");
  Object.assign(videoEle.style, videoEleCss);

  div.appendChild(videoEle);
  div.appendChild(span);

  groupVideoCallMainDiv.appendChild(div);
};

export const handleConnPrepare = (data) => {
  const socket = getSocket();
  const { connUserSocketId, userId } = data; // both of them are of the person who just joined

  prepareNewPeerConnection(connUserSocketId, userId, false);
  socket.emit("conn-init", { connUserSocketId: connUserSocketId });
};

const prepareNewPeerConnection = (connUserSocketId, userId, isInitiator) => {
  const configuration = getConfiguration();

  if (!peers[connUserSocketId] || peers[connUserSocketId].destroyed) {
    peers[connUserSocketId] = new Peer({
      initiator: isInitiator,
      config: configuration,
      stream: localStream,
    });
  }

  peers[connUserSocketId].on("stream", (stream) => {
    if (!streams.includes(stream)) {
      addStream(stream, connUserSocketId, userId);
      streams = [...streams, stream];
    }
  });

  peers[connUserSocketId].on("signal", (data) => {
    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
    };
    if (signalData.signal && !peers[connUserSocketId].destroyed) {
      signalPeerData(signalData); // Make sure this function doesn't send signal data twice
    }
  });
  peers[connUserSocketId].on("close", () => {});
};

const addStream = (stream, connUserSocketId, userId) => {
  const groupState = store.getState().groups;

  const user = groupState.groupIdToGroupName[userId]
    ? groupState.groupIdToGroupName[userId]
    : null;

  if (!user) {
    console.error(`User with ID ${userId} not found`);
    return;
  }

  // TODO - onclick the screen should expnad
  showOtherPreview(stream, user);
};

const signalPeerData = (signalData) => {
  const socket = getSocket();
  socket.emit("conn-signal", signalData);
};

export const handleSignalingData = (data) => {
  peers[data.connUserSocketId].signal(data.signal);
};

export const handleConnInit = (data) => {
  const { connUserSocketId, userId } = data;

  prepareNewPeerConnection(connUserSocketId, userId, true);
};

export const toggleMic = (isMicMuted) => {
  localStream.getAudioTracks()[0].enabled = isMicMuted ? true : false;
};

export const toggleCamera = (isDisabled) => {
  localStream.getVideoTracks()[0].enabled = isDisabled ? true : false;
};

export const toggleScreenShare = (
  isScreenSharingActive,
  screenSharingStream
) => {
  if (isScreenSharingActive) {
    switchVideoTracks(localStream);
    changeMyStreamToo(localStream);
  } else {
    switchVideoTracks(screenSharingStream);
    changeMyStreamToo(screenSharingStream);
  }
};

const switchVideoTracks = (newStream) => {
  for (let socketId in peers) {
    const peerStream = peers[socketId].streams[0];
    for (let oldTrack of peerStream.getTracks()) {
      for (let newTrack of newStream.getTracks()) {
        if (oldTrack.kind === newTrack.kind) {
          peers[socketId].replaceTrack(oldTrack, newTrack, peerStream);
          break;
        }
      }
    }
  }
};

const changeMyStreamToo = (stream) => {
  const groupVideoCallMainDiv = document.querySelector(
    ".groupVideoCall-mainDiv"
  );
  const localUserVideoDiv =
    groupVideoCallMainDiv.querySelector(".local-user-video");
  if (localUserVideoDiv) {
    const videoEle = localUserVideoDiv.querySelector("video");
    if (videoEle) {
      videoEle.srcObject = stream;
      videoEle.onloadedmetadata = () => {
        videoEle.play();
      };
    }
  }
};

const removeFullScreenEventListeners = () => {
  const groupVideoCallMainDiv = document.querySelector(
    ".groupVideoCall-mainDiv"
  );

  while (groupVideoCallMainDiv.firstChild) {
    const child = groupVideoCallMainDiv.firstChild;
    if (child.querySelector("video") && toggleFullScreen) {
      child.removeEventListener("click", toggleFullScreen);
    }
    groupVideoCallMainDiv.removeChild(child);
  }
};

export const removeGroupVideoChairsOccupied = (userId, me = false) => {
  const groupState = store.getState().groups;
  const movementState = store.getState().movement;
  let seatOccupied;
  if (me) {
    seatOccupied = [movementState.playerX, movementState.playerY];
  } else {
    seatOccupied = groupState.groupParticipants[userId] || null;
  }

  if (seatOccupied) {
    const updatedSeats = groupState.groupVideoChatSeatsOccupied.filter(
      (seat) => !(seat[0] === seatOccupied[1] && seat[1] === seatOccupied[0])
    );

    store.dispatch(setGroupVideoChatSeatsOccupied(updatedSeats));
  }
};

const removeAllPeersConnection = () => {
  Object.entries(peers).forEach(([key, value]) => {
    if (value) {
      value.destroy();
    }
    delete peers[key];
  });
  peers = {};
};
const removeAllStreams = () => {
  streams.forEach((stream) => {
    stream.getTracks().forEach((track) => track.stop());
  });
  streams = [];
};

export const leaveVideoCall = () => {
  const groupState = store.getState().groups;
  const socket = getSocket();
  const movementState = store.getState().movement;

  removeFullScreenEventListeners();
  removeAllPeersConnection();
  removeAllStreams();

  removeGroupVideoChairsOccupied(groupState.selectedGroup.myId, true);

  store.dispatch(setEnteredGroupVideoChat(false));

  socket.emit("i-left-group-video-chat", {
    groupId: groupState.selectedGroup.id,
    groupName: groupState.selectedGroup.name,
  });

  addedUsers.clear();
  localStream = null;

  window.location.reload();
};

export const someoneLeftGroupVideoCall = (data) => {
  const { socketId, userId } = data;
  const groupState = store.getState().groups;

  // make sure to dlete the occupied set too
  removeGroupVideoChairsOccupied(userId);
  const userWhoLeft = groupState.groupIdToGroupName[userId];

  if (userWhoLeft) {
    const div = document.querySelector(`#${userWhoLeft[0]}`);

    if (div) {
      const videoEle = div.querySelector("video");

      if (div && videoEle) {
        const tracks = videoEle.srcObject.getTracks();
        tracks.forEach((track) => track.stop());

        div.removeChild(videoEle);
        if (toggleFullScreen) {
          div.removeEventListener("click", toggleFullScreen);
        }

        div.parentNode.removeChild(div);
      }

      if (peers[socketId]) {
        peers[socketId].destroy();
      }
      delete peers[socketId];

      addedUsers.delete(userWhoLeft[0]);
    }
  }
};
