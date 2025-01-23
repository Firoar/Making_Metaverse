import store from "../../../../store/store.js";
import Peer from "simple-peer";
import {
  displayGrid,
  gridStyle,
  hideScrollBar,
  nameSpanCss,
  testingStyle,
  videoDivCss,
  videoEleCss,
} from "./jsCss.js";
import { getSocket } from "../../../../services/socketService.js";

let localStream;
let peers = {};
let streams = [];
const addedUsers = new Set();

const defaultConstraints = {
  audio: true,
  video: {
    width: "480",
    height: "360",
  },
};
const getConfiguration = () => {
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
            console.log(seatOccupied);
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

  const videoEle = document.createElement("video");
  videoEle.autoplay = true;
  videoEle.muted = true;
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

  console.log("Bro got his stream, wait a sec:", otherUser);

  if (addedUsers.has(otherUser[0])) {
    console.log(`User ${otherUser[0]} is already added.`);
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

  const videoEle = document.createElement("video");
  videoEle.autoplay = true;
  videoEle.muted = true;
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
  console.log(
    "hi-from conn-prepare ",
    userId,
    " just joined video call so sent conn-prepare reuqest. Data : ",
    data
  );
  prepareNewPeerConnection(connUserSocketId, userId, false);
  socket.emit("conn-init", { connUserSocketId: connUserSocketId });
};

const prepareNewPeerConnection = (connUserSocketId, userId, isInitiator) => {
  const configuration = getConfiguration();

  peers[connUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
  });

  peers[connUserSocketId].on("stream", (stream) => {
    addStream(stream, connUserSocketId, userId);
    streams = [...streams, stream];
  });

  peers[connUserSocketId].on("signal", (data) => {
    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
    };
    signalPeerData(signalData);
  });
};

const addStream = (stream, connUserSocketId, userId) => {
  console.log("adding stream bro : ", userId);

  const groupState = store.getState().groups;
  console.log(
    groupState.groupIdToGroupName,
    groupState.groupIdToGroupName[userId][0]
  );
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
  console.log("signaling data bro : ", data, " connected now i guess");

  peers[data.connUserSocketId].signal(data.signal);
};

export const handleConnInit = (data) => {
  console.log(
    "bro they reponseded to my conn-pepare by sending me conn-init, see this is ther id and sockey id",
    data
  );
  const { connUserSocketId, userId } = data;

  prepareNewPeerConnection(connUserSocketId, userId, true);
};
