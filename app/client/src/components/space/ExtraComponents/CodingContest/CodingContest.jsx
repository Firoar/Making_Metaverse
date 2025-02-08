import React, { useEffect, useState } from "react";
import classes from "./codingContest.module.css";
import { useSelector } from "react-redux";
import BackButton from "./BackButton";
import GiveMeYourUserName from "./GiveMeYourUserName";
import GiveMeAQuestion from "./GiveMeAQuestion";
import ChangeUsernameButton from "./ChangeUsernameButton";

const CodingContest = () => {
  const [changeUserName, setChangeUserName] = useState(false);
  const { enteredLeetcodeArea } = useSelector((state) => state.groups);
  const { playerLeetcodeUsername } = useSelector((state) => state.movement);

  useEffect(() => {
    if (enteredLeetcodeArea) {
      if (!playerLeetcodeUsername) {
        setChangeUserName(true);
      }
    }
  }, [enteredLeetcodeArea]);

  if (!enteredLeetcodeArea) return null;
  return (
    <div className={classes["codingContest-div"]}>
      <div className={classes["codingContest-main"]}>
        {changeUserName ? (
          <GiveMeYourUserName setChangeUserName={setChangeUserName} />
        ) : (
          <>
            <GiveMeAQuestion />
            <ChangeUsernameButton
              changeUserName={changeUserName}
              setChangeUserName={setChangeUserName}
            />
          </>
        )}
        <BackButton />
      </div>
    </div>
  );
};
export default CodingContest;
