import React from "react";
import classes from "../map.module.css";

const ParticipantsImage = ({ src, name, pos, mapPos }) => {
  const pLeft = pos[0] - Math.abs(mapPos[0]);
  const pTop = pos[1] - Math.abs(mapPos[1]);

  return (
    <div
      className={classes["map-ball-other-div"]}
      style={{
        left: `${pLeft * 16}px`,
        top: `${pTop * 16}px`,
      }}
    >
      <img
        className={classes["map-other-ball-img"]}
        src={src}
        alt={`${name}'s avatar`}
      />
      <p className={classes["map-ball-other-div-p"]}>{name}</p>
    </div>
  );
};

export default ParticipantsImage;
