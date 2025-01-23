import React from "react";
import AuthForm from "./AuthForm";
import ErrorText from "./ErrorText";
import SubmitButton from "./SubmitButton";
import classes from "./authCss/signUp.module.css";
import NavigateTo from "./NavigateTo";

const SignUp = () => {
  return (
    <div className={classes["signUp-div"]}>
      <AuthForm isSignIn={false} />
      <SubmitButton isSignIn={false} />
      <NavigateTo isSignIn={false} />
      <ErrorText />
    </div>
  );
};
export default SignUp;
