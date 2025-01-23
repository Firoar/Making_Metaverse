import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMapLeft,
  setMapTop,
  setPlayerLeft,
  setPlayerTop,
  setPlayerX,
  setPlayerY,
} from "../../../../store/features/movement/movementSlice.js";
import classes from "../map.module.css";
import { checkBoundary } from "../../../../utils/checkBoundry.js";
import { getSocket } from "../../../../services/socketService.js";

// Define constants for boundaries
const BOUNDARY_VALUES = {
  MAX: 36,
  MIN: 25,
  OFFSET: 11,
};

const MapImage = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const { mapTop, mapLeft, playerX, playerY } = useSelector(
    (state) => state.movement
  );
  const { selectedGroup } = useSelector((state) => state.groups);

  const handleMovement = useCallback(
    (deltaX, deltaY) => {
      if (!checkBoundary(playerX, playerY, deltaX, deltaY)) {
        const data = {
          groupId: selectedGroup.id,
          groupName: selectedGroup.name,
          posX: playerX + deltaX,
          posY: playerY + deltaY,
        };
        socket.emit("i-moved", data);
        dispatch(setPlayerX(playerX + deltaX));
        dispatch(setPlayerY(playerY + deltaY));
      }
    },
    [playerX, playerY, selectedGroup, dispatch, socket]
  );

  const handleKeyPress = useCallback(
    (event) => {
      const movementMap = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
      };

      const movement = movementMap[event.key];
      if (movement) handleMovement(...movement);
    },
    [handleMovement]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const { MAX, MIN, OFFSET } = BOUNDARY_VALUES;

    const updatePosition = (coordinate, isHorizontal) => {
      if (coordinate >= MAX) return [-OFFSET, coordinate - OFFSET];
      if (coordinate <= MIN) return [0, coordinate];
      if (coordinate > MIN && coordinate < MAX) return [24 - coordinate, 24];
      return isHorizontal ? [mapLeft, playerX] : [mapTop, playerY];
    };

    const [newMapLeft, newPlayerLeft] = updatePosition(playerX, true);
    const [newMapTop, newPlayerTop] = updatePosition(playerY, false);

    dispatch(setMapLeft(newMapLeft));
    dispatch(setPlayerLeft(newPlayerLeft));
    dispatch(setMapTop(newMapTop));
    dispatch(setPlayerTop(newPlayerTop));
  }, [playerX, playerY, dispatch]);

  return (
    <div className={classes["map-container"]}>
      <img
        src="/mapv3.png" // Ensure the path is correct.
        className={classes["map-img"]}
        style={{
          left: `calc(16 * ${mapLeft}px)`,
          top: `calc(16 * ${mapTop}px)`,
        }}
        alt="Map"
      />
    </div>
  );
};

export default MapImage;
