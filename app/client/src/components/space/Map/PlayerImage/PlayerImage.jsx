import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "../map.module.css";

const PlayerImage = () => {
  const dispatch = useDispatch();
  const { playerLeft, playerTop, playerName } = useSelector(
    (state) => state.movement
  );
  const { selectedGroup } = useSelector((state) => state.groups);

  return (
    <>
      <div
        className={classes["map-ball-div"]}
        style={{
          left: `calc(${playerLeft} * 16px)`,
          top: `calc(${playerTop} * 16px)`,
        }}
      >
        <img
          src={`./${selectedGroup.myCharColor.toLowerCase()}-ball.png`}
          className={classes["map-ball-img"]}
        />
        <p className={classes[""]}>{playerName}</p>
      </div>
    </>
  );
};
export default PlayerImage;
