import React, { useEffect, useState } from "react";
import classes from "./gameArea.module.css";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "./BackButton";
import { startGamefn } from "./game.js";

const GameArea = () => {
  const { enteredTypingGameArea } = useSelector((state) => state.groups);
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    if (startGame) {
      try {
        startGamefn();
      } catch (error) {
        console.error("Error starting the game:", error);
      }
    }
  }, [startGame]);
  const handleStartTheGame = () => {
    setStartGame(true);
  };

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

        {!startGame && <BackButton />}
      </div>
    </div>
  );
};
export default GameArea;
