import React from "react";
import classes from "./authCss/submitButton.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthError,
  setEmail,
  setPassword,
  setUsername,
} from "../../store/features/auth/authSlice.js";
import axios from "axios";
import { useNavigate } from "react-router";

const SERVER_URL = "http://localhost:3000";

const SubmitButton = ({ isSignIn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password, username, authError } = useSelector(
    (state) => state.auth
  );

  const handleNavigate = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/is-user-new`, {
        withCredentials: true,
      });

      if (response.data.ok) {
        console.log(response.data);
        if (response.data.isNewUser) {
          navigate("/app");
        } else {
          navigate("/space");
        }
      } else {
        console.log(response);
        throw new Error("something went wrong");
      }
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if ((!isSignIn && !email) || !password || !username) {
      dispatch(setAuthError("Fields cannot be empty"));
      return;
    }
    const data = isSignIn
      ? { username, password }
      : { email, username, password };

    try {
      const response = await axios.post(
        `${SERVER_URL}/api/auth?signin=${isSignIn}`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.data.ok) {
        dispatch(setEmail(""));
        dispatch(setPassword(""));
        dispatch(setUsername(""));
        dispatch(setAuthError(""));

        if (isSignIn) {
          await handleNavigate();
        } else {
          navigate("/signin");
        }
      }
    } catch (error) {
      dispatch(setEmail(""));
      dispatch(setPassword(""));
      dispatch(setUsername(""));
      console.log(error);
      dispatch(
        setAuthError(error.response.data.message || "Something went wrong")
      );
    }
  };

  return (
    <button className={classes["submitBtn"]} onClick={handleSubmit}>
      SubmitButton
    </button>
  );
};
export default SubmitButton;
