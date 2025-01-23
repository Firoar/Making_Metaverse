import React from "react";
import { useNavigate } from "react-router";
import "./css/App.css";
import classes from "./css/App.module.css";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <div className={classes["app-div"]}>
        <button onClick={() => navigate("/signup")}> Sign Up</button>
        <button onClick={() => navigate("/signin")}>Sign In</button>
      </div>
    </>
  );
}

export default App;
