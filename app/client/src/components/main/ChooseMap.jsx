import React, { useState } from "react";
import classes from "./MainCss/chooseMap.module.css";
import { useNavigate } from "react-router";
import ColorDropdown from "./ColorDropDown";
import InputBox from "./InputBox";
import DisplayAllMaps from "./DisplayAllMaps";
import ProccedButton from "./ProccedButton";

const ChooseMap = ({
  colorChoosed,
  setColorChoosed,
  setClickedSelectColor,
}) => {
  const [selectedMapId, setSelectedMapId] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [errorMsg, setErrorMsg] = useState("error !!");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className={classes["main-div-name"]}>
        <InputBox setGroupName={setGroupName} groupName={groupName} />

        <ColorDropdown
          colorChoosed={colorChoosed}
          setClickedSelectColor={setClickedSelectColor}
        />

        {isError && <p className={classes["error-msg"]}>{errorMsg}</p>}
      </div>

      <div className={classes["main-div"]}>
        <h1>Choose a Map for Your Group</h1>

        <DisplayAllMaps
          setSelectedMapId={setSelectedMapId}
          selectedMapId={selectedMapId}
        />

        <ProccedButton
          selectedMapId={selectedMapId}
          groupName={groupName}
          colorChoosed={colorChoosed}
          setIsError={setIsError}
          setErrorMsg={setErrorMsg}
        />
      </div>
    </>
  );
};

export default ChooseMap;
