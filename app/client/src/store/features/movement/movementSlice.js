import { createSlice } from "@reduxjs/toolkit";
import { AreaIndex } from "../../../assets/finalMatrixValue.js";

export const randomSpawn = (val = "spawnarea") => {
  const length = AreaIndex[val].length;

  const randomIndex = Math.floor(Math.random() * length);
  let [x, y] = AreaIndex[val][randomIndex];
  return [y, x];
};

const randomSpawnCoordinate = randomSpawn();

const initialState = {
  playerX: randomSpawnCoordinate[0],
  playerY: randomSpawnCoordinate[1],
  playerColor: "",
  playerLeft: 0,
  playerTop: 0,
  mapLeft: -6,
  mapTop: -6,
  playerName: "",
  lastPlayerX: -1,
  lastPlayerY: -1,
  playerLeetcodeUsername: "",
};

export const movementSlice = createSlice({
  name: "movement",
  initialState,
  reducers: {
    setPlayerLeft: (state, action) => {
      state.playerLeft = action.payload;
    },
    setPlayerTop: (state, action) => {
      state.playerTop = action.payload;
    },
    setMapLeft: (state, action) => {
      state.mapLeft = action.payload;
    },
    setMapTop: (state, action) => {
      state.mapTop = action.payload;
    },
    setPlayerX: (state, action) => {
      state.playerX = action.payload;
    },
    setPlayerY: (state, action) => {
      state.playerY = action.payload;
    },
    setPlayerColor: (state, action) => {
      state.playerColor = action.payload;
    },
    setPlayerName: (state, action) => {
      state.playerName = action.payload;
    },
    setLastPlayerX: (state, action) => {
      state.lastPlayerX = action.payload;
    },
    setLastPlayerY: (state, action) => {
      state.lastPlayerY = action.payload;
    },
    setPlayerLeetcodeUsername: (state, action) => {
      state.playerLeetcodeUsername = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const {
  setMapLeft,
  setMapTop,
  setPlayerLeft,
  setPlayerTop,
  setPlayerX,
  setPlayerY,
  setPlayerColor,
  setPlayerName,
  setLastPlayerX,
  setLastPlayerY,
  setPlayerLeetcodeUsername,
  logout,
} = movementSlice.actions;
export default movementSlice.reducer;
