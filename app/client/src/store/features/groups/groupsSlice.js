import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedGroup: null,
  allGroups: [],
  groupParticipants: {},
  groupIdToGroupName: {},
  selectedGroupChat: [],
  clickedAddGroup: false,
  enteredGroupVideoChat: false,
  enteredPeerVideoChat: false,
  enteredLeetcodeArea: false,
  enteredTypingGameArea: false,
  groupVideoChatSeatsOccupied: [],
  peerVideoChatSeatsOccupied: [],
  leetCodeAreaSeatsOccupied: [],
  typingAreaSeatsOccupied: [],
  peers: {},
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
    setAllGroups: (state, action) => {
      state.allGroups = action.payload;
    },
    setAllGroupParticipants: (state, action) => {
      state.groupParticipants = action.payload;
    },
    setGroupParticipants: (state, action) => {
      const { id, coordinates } = action.payload;

      state.groupParticipants[id] = coordinates;
    },

    setGroupIdToGroupName: (state, action) => {
      state.groupIdToGroupName = action.payload;
    },
    setSelectedGroupChat: (state, action) => {
      state.selectedGroupChat = action.payload;
    },
    setClickedAddGroup: (state, action) => {
      state.clickedAddGroup = action.payload;
    },
    setEnteredGroupVideoChat: (state, action) => {
      state.enteredGroupVideoChat = action.payload;
    },
    setEnteredPeerVideoChat: (state, action) => {
      state.enteredPeerVideoChat = action.payload;
    },
    setEnteredLeetcodeArea: (state, action) => {
      state.enteredLeetcodeArea = action.payload;
    },
    setEnteredTypingGameArea: (state, action) => {
      state.enteredTypingGameArea = action.payload;
    },
    setGroupVideoChatSeatsOccupied: (state, action) => {
      state.groupVideoChatSeatsOccupied = action.payload;
    },
    setPeerVideoChatSeatsOccupied: (state, action) => {
      state.peerVideoChatSeatsOccupied = action.payload;
    },
    setLeetCodeAreaSeatsOccupied: (state, action) => {
      state.leetCodeAreaSeatsOccupied = action.payload;
    },
    setTypingAreaSeatsOccupied: (state, action) => {
      state.typingAreaSeatsOccupied = action.payload;
    },
    setPeers: (state, action) => {
      state.peers = action.payload;
    },

    logout: () => {
      return initialState;
    },
  },
});

export const {
  setSelectedGroup,
  setGroupParticipants,
  setAllGroupParticipants,
  setAllGroups,
  setGroupIdToGroupName,
  setSelectedGroupChat,
  setClickedAddGroup,
  setEnteredGroupVideoChat,
  setEnteredLeetcodeArea,
  setEnteredPeerVideoChat,
  setEnteredTypingGameArea,
  setGroupVideoChatSeatsOccupied,
  setTypingAreaSeatsOccupied,
  setLeetCodeAreaSeatsOccupied,
  setPeerVideoChatSeatsOccupied,
  logout,
} = groupsSlice.actions;

export default groupsSlice.reducer;
