import React, { useState } from "react";
import classes from "./MainCss/chooseMap.module.css";
import axios from "axios";
import { useNavigate } from "react-router";
import { notify } from "../../utils/toasts";
import { getSocket } from "../../services/socketService";

const JoinGroup = () => {
  const [inviteCode, setInviteCode] = useState("");

  const navigate = useNavigate();
  const socket = getSocket();
  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`You entered: ${inviteCode}`);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}api/join-group`,
        { inviteCode: inviteCode },
        {
          withCredentials: true,
        }
      );

      console.log(response);
      if (response.data.ok) {
        navigate("/space");
      }
    } catch (error) {
      notify("error joining group", "error");
      console.log(error);
    }
  };

  return (
    <div className={classes["main-div-1"]}>
      <form onSubmit={handleSubmit} className={classes["form-container"]}>
        <input
          onChange={(e) => setInviteCode(e.target.value)}
          type="text"
          value={inviteCode}
          placeholder="Enter group ID / Invite ID"
          className={classes["input-field"]}
        />
        <button type="submit" className={classes["submit-button"]}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default JoinGroup;
