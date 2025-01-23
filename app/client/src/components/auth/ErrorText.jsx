import React from "react";
import { useSelector } from "react-redux";
import classes from "./authCss/errorText.module.css";

const ErrorText = () => {
  const { authError } = useSelector((state) => state.auth);
  return authError ? (
    <div className={classes["errorText-div"]}>{authError}</div>
  ) : (
    <></>
  );
};
export default ErrorText;
