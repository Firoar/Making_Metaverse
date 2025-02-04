import React, { useEffect, useState } from "react";
import classes from "./gameArea.module.css";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "./BackButton";
import { startGamefn } from "./game.js";
import { notify } from "../../../../utils/toasts.js";
import axios from "axios";

const GameArea = () => {
  const { enteredTypingGameArea, selectedGroup } = useSelector(
    (state) => state.groups
  );
  const [startGame, setStartGame] = useState(false);
  const [disableBackButton, setDisableBackButton] = useState(false);
  const [playerScore, setPlayerScore] = useState(null);

  const handleStartTheGame = () => {
    console.log("start");

    setStartGame(true);
    setDisableBackButton(true);
  };

  const handleGameEnded = (score) => {
    setDisableBackButton(false);
    setPlayerScore(score);
  };

  const updateMyScore = async (score) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}api/update-my-typing-speed`,
        {
          userId: selectedGroup.myId,
          score: score,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      notify("Error updating score.", "error");
      console.log(error);
    }
  };

  useEffect(() => {
    if (startGame) {
      try {
        startGamefn(handleGameEnded);
      } catch (error) {
        console.error("Error starting the game:", error);
      }
    }
  }, [startGame]);

  useEffect(() => {
    if (playerScore !== null) {
      console.log("score: ", playerScore);
      updateMyScore(playerScore);
      console.log("jai sri ram");
    }
  }, [playerScore]);

  if (!enteredTypingGameArea) return null;
  return (
    <div className={classes["gameArea-div"]}>
      <div className={classes["gameArea-all"]}>
        <div className={`${classes["gameArea-main"]} gameArea-main`}>
          {!startGame ? (
            <button
              className={classes["startGame-btn"]}
              onClick={handleStartTheGame}
            >
              Start the Game
            </button>
          ) : (
            <canvas></canvas>
          )}
        </div>

        {!disableBackButton && <BackButton setStartGame={setStartGame} />}
      </div>
    </div>
  );
};
export default GameArea;
