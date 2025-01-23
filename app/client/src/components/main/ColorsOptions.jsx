import React, { useEffect } from "react";
import classes from "./MainCss/mainCss.module.css";

const ColorsOptions = ({
  clickedSelectColor,
  setClickedSelectColor,
  setColorChoosed,
}) => {
  const colors = [
    { name: "Red", value: "red" },
    { name: "Blue", value: "blue" },
    { name: "Yellow", value: "yellow" },
    { name: "Green", value: "green" },
    { name: "Silver", value: "silver" },
    { name: "Orange", value: "orange" },
    { name: "Indigo", value: "indigo" },
    { name: "Purple", value: "purple" },
    { name: "Wheat", value: "wheat" },
    { name: "Pink", value: "pink" },
  ];

  const handleColorChoose = (name) => {
    setColorChoosed(name);
    setClickedSelectColor((prev) => !prev);
  };

  return (
    <div
      className={`${classes["color-options-div"]} ${
        clickedSelectColor
          ? classes["color-option-div-show"]
          : classes["color-option-div-noshow"]
      }`}
    >
      {colors.map((color) => {
        return (
          <div
            className={classes["color-option"]}
            key={color.name}
            onClick={() => handleColorChoose(color.name)}
          >
            <div
              className={classes["color-box"]}
              style={{
                backgroundColor: `${color.value}`,
                outline: "1px solid black",
              }}
            ></div>
            <p>{color.name}</p>
          </div>
        );
      })}
    </div>
  );
};
export default ColorsOptions;
