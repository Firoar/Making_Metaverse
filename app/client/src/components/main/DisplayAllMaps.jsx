import React from "react";
import classes from "./MainCss/chooseMap.module.css";

const allMaps = [
  {
    id: 1,
    link: "./mapv3.png",
    name: "College",
  },
];

const DisplayAllMaps = ({ selectedMapId, setSelectedMapId }) => {
  const handleMapClick = (map) => {
    console.log(`Map selected: ${map.name}`);
    alert("You selected map: " + map.name);
    setSelectedMapId(map.id);
  };
  return (
    <div className={classes["maps-container"]}>
      {allMaps.map((map) => (
        <div
          key={map.id}
          className={`${classes["map-card"]} ${
            selectedMapId === map.id ? classes["selected-map"] : ""
          }`}
          onClick={() => handleMapClick(map)}
        >
          <img
            src={map.link}
            alt={map.name}
            className={classes["map-images"]}
          />
          <p className={classes["map-name"]}>{map.name}</p>
        </div>
      ))}
    </div>
  );
};
export default DisplayAllMaps;
