import React from "react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import UserInput from "./UserInput";
import { useDispatch, useSelector } from "react-redux";
import classes from "./authCss/authForm.module.css";
import {
  setEmail,
  setPassword,
  setUsername,
} from "../../store/features/auth/authSlice";

const AuthForm = ({ isSignIn }) => {
  const dispatch = useDispatch();
  const { email, password, username } = useSelector((state) => state.auth);

  return (
    <div className={classes["authform-div"]}>
      {!isSignIn && (
        <EmailInput
          value={email}
          onChange={(value) => dispatch(setEmail(value))}
        />
      )}

      <UserInput
        value={username}
        onChange={(value) => dispatch(setUsername(value))}
      />

      <PasswordInput
        value={password}
        onChange={(value) => dispatch(setPassword(value))}
      />
    </div>
  );
};

export default AuthForm;
