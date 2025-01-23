import React from "react";
import AuthForm from "./AuthForm";
import SubmitButton from "./SubmitButton";
import ErrorText from "./ErrorText";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import classes from "./authCss/signIn.module.css";
import NavigateTo from "./NavigateTo";

const SERVER_URL = "http://localhost:3000";

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkIsAuth = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/protected`, {
          withCredentials: true,
        });

        if (response.data.ok) {
          navigate("/app");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkIsAuth();
  }, []);

  return (
    <div className={classes["signIn-div"]}>
      <AuthForm isSignIn={true} />
      <SubmitButton isSignIn={true} />
      <NavigateTo isSignIn={true} />
      <ErrorText />
    </div>
  );
};
export default SignIn;
