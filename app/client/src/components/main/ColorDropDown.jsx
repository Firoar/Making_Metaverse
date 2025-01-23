import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import classes from "./MainCss/chooseMap.module.css";

function ColorDropdown({ colorChoosed, setClickedSelectColor }) {
  // const placeholder = "Select a color for your Character";

  return (
    <div className={classes["color-dropdown-div"]}>
      <button onClick={() => setClickedSelectColor((prev) => !prev)}>
        {colorChoosed}
        <FaChevronDown
          style={{ position: "absolute", top: "12px", right: "10px" }}
        />
      </button>
    </div>
  );
}

export default ColorDropdown;
