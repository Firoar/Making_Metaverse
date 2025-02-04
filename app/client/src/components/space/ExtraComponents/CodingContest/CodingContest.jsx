import React, { useEffect } from "react";
import classes from "./codingContest.module.css";
import { useSelector } from "react-redux";

const CodingContest = () => {
  const { enteredLeetcodeArea } = useSelector((state) => state.groups);

  useEffect(() => {
    if (enteredLeetcodeArea) {
    }
  }, [enteredLeetcodeArea]);

  if (!enteredLeetcodeArea) return null;
  return <div className={classes["codingContest-div"]}>CodingContest</div>;
};
export default CodingContest;
