import React, { useState } from "react";
import classes from "../main/MainCss/mainCss.module.css";
import ChooseMap from "../main/ChooseMap";
import ColorsOptions from "../main/ColorsOptions";

const ChooseGrp = () => {
  const [clickedSelectColor, setClickedSelectColor] = useState(false);
  const [colorChoosed, setColorChoosed] = useState(
    "Select a color for your Character"
  );

  return (
    <div className={classes["main-div-req"]}>
      <ChooseMap
        setClickedSelectColor={setClickedSelectColor}
        colorChoosed={colorChoosed}
        setColorChoosed={setColorChoosed}
      />

      <ColorsOptions
        clickedSelectColor={clickedSelectColor}
        setColorChoosed={setColorChoosed}
        setClickedSelectColor={setClickedSelectColor}
      />
    </div>
  );
};
export default ChooseGrp;
