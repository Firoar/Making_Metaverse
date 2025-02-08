import React, { useState } from "react";
import classes from "./codingContest.module.css";
import { notify } from "../../../../utils/toasts.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPlayerLeetcodeUsername } from "../../../../store/features/movement/movementSlice.js";

const GiveMeYourUserName = ({ setChangeUserName }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");

  const saveHisUserName = async (username) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}api/change-his-leetcode-username`,
        {
          username: username,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.data.ok) {
        setChangeUserName(false);
      }
    } catch (error) {
      notify("couldnt save your username, try again later!!", "error");
      console.log(error);
    }
  };

  const handleChangeClicked = async () => {
    if (!username || username.trim() === "") return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LEETCODE_URL}${username}`
      );

      if (response.data.errors) {
        notify("this username doesnt exist", "error");
      } else {
        dispatch(setPlayerLeetcodeUsername(username));
        await saveHisUserName(username);
      }
    } catch (error) {
      notify("something went wrong, try again later", "error");
      console.log(error);
    }
  };

  return (
    <div className={classes["username-form-div"]}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="type your leetcode's username"
      />
      <button onClick={handleChangeClicked}>Change</button>
    </div>
  );
};
export default GiveMeYourUserName;
