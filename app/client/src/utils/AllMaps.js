import {
  groupVideoChairs,
  leetCodeContestArea,
  peerVideoChairs,
  typingContestArea,
} from "../assets/AllMaps.js";
import store from "../store/store.js";

export const belongInsideGroupVideoChairs = (x, y) => {
  const key = JSON.stringify([x, y]);

  if (groupVideoChairs.has(key) && groupVideoChairs.get(key) == true)
    return true;
  return false;
};

export const InGroupVideoChairs = (x, y) => {
  const state = store.getState();
  const alreadyPresent = state.groups.groupVideoChatSeatsOccupied.find(
    (seat) => seat[0] === x && seat[1] === y
  );
  if (alreadyPresent) {
    return false;
  }
  return belongInsideGroupVideoChairs(x, y);
};

export const InPeerVideoChairs = (x, y) => {
  const key = JSON.stringify([x, y]);
  if (peerVideoChairs.has(key) && peerVideoChairs.get(key) == true) return true;
  return false;
};

export const InTypingContestArea = (x, y) => {
  const key = JSON.stringify([x, y]);
  if (typingContestArea.has(key) && typingContestArea.get(key) == true)
    return true;
  return false;
};

export const InLeetCodeContestArea = (x, y) => {
  const key = JSON.stringify([x, y]);
  if (leetCodeContestArea.has(key) && leetCodeContestArea.get(key) == true)
    return true;
  return false;
};
