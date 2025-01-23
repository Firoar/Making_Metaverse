import React from "react";
import { useNavigate } from "react-router";
import classes from "./authCss/navigateTo.module.css";

const NavigateTo = ({ isSignIn }) => {
  return isSignIn ? (
    <div className={classes["navigateTo-div"]}>
      New here? <a href="/signup">Sign Up</a>
    </div>
  ) : (
    <div className={classes["navigateTo-div"]}>
      Already have an account? <a href="/signin">Sign In</a>
    </div>
  );
};
export default NavigateTo;
