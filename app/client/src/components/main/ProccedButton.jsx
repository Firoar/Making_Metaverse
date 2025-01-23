import React from "react";
import classes from "./MainCss/chooseMap.module.css";
import axios from "axios";
import { useNavigate } from "react-router";
import { notify } from "../../utils/toasts";
import { getSocket } from "../../services/socketService";

const ProccedButton = ({
  selectedMapId,
  groupName,
  colorChoosed,
  setIsError,
  setErrorMsg,
}) => {
  const socket = getSocket();
  const navigate = useNavigate();

  const handleProceedClick = async () => {
    if (!selectedMapId) {
      alert("Please select a map before proceeding!");
      return;
    }
    if (!groupName) {
      alert("Please enter a group name!");
      return;
    }

    if (!colorChoosed) {
      alert("Please enter a color for your Character");
    }

    console.log(
      `Proceeding with Map ID: ${selectedMapId}, Group: ${groupName}`
    );

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/is-group-name-uniq`,
        {
          withCredentials: true,
          params: { groupName },
        }
      );

      if (response.data.ok) {
        if (!response.data.found) {
          const createGroupResponse = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}api/create-new-group`,
            {
              groupName: groupName,
              mapId: selectedMapId,
              colorChoosed: colorChoosed,
            },
            { withCredentials: true }
          );

          if (createGroupResponse.data.ok) {
            // console.log(response.data);

            navigate("/space");
          }
        } else {
          throw new Error("Group name Already exist. Choose Another one");
        }
      }
    } catch (error) {
      console.log(error);

      //  handleExit={handleExit}
      if (error.status === 401) {
        notify("Unauthorized. Please signIn", "error");
        navigate("/signin");
      }
      notify("Error!", error);
      setIsError(true);
      setErrorMsg(error.data.message);
    }
  };

  return (
    <button className={classes["proceed-button"]} onClick={handleProceedClick}>
      Proceed
    </button>
  );
};
export default ProccedButton;
