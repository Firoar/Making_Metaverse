import axios from "axios";
import React from "react";
import { useNavigate } from "react-router";
import { handleLogout } from "../../../utils/importantFunction.js";
import classes from "./navbar.module.css";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className={classes["space-navbar"]}>
      <h1>MetaVerse</h1>

      <div className={classes["space-navbar-button-div"]}>
        <button onClick={() => handleLogout(navigate, dispatch)}>
          Log Out
        </button>
      </div>
    </div>
  );
};
export default Navbar;
