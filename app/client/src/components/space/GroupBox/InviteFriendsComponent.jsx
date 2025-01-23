import React from "react";
import classes from "./groupBox.module.css";
import axios from "axios";
import { notify } from "../../../utils/toasts.js";

const InviteFriendsComponent = ({ group }) => {
  const handleClickedInviteFriends = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/get-group-invite-code`,
        {
          withCredentials: true,
          params: {
            groupId: group.id,
          },
        }
      );
      if (response.data.ok) {
        await navigator.clipboard.writeText(
          `Invite Code : ${response.data.code}`
        );
        notify("Invite code copied to clipboard!", "success");
      }
    } catch (error) {
      notify("Error getting invite code!", "error");
      console.log(error);
    }
  };
  return (
    <div
      className={classes["groupDiv-inviteDiv"]}
      onClick={handleClickedInviteFriends}
    >
      <img
        className={classes["groupDiv-inviteImg"]}
        src="./invite-friends-image.png"
        alt="invite"
      />
    </div>
  );
};
export default InviteFriendsComponent;
