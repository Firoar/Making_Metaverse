import { Jokes } from "../../models/Jokes.js";
import { jokesArr } from "./jokesArr.js";

export const fillJokesTable = async () => {
  const count = await Jokes.count();

  if (count === 0) {
    for (let arr of jokesArr) {
      for (let joke of arr) {
        try {
          if (joke.delivery && joke.setup) {
            await Jokes.create({
              setup: joke.setup,
              delivery: joke.delivery,
            });
          } else if (joke.joke) {
            await Jokes.create({
              joke: joke.joke,
            });
          }
        } catch (error) {
          if (error.name === "SequelizeUniqueConstraintError") {
            // Ignore unique constraint error (if joke already exists)
          } else {
            console.error("Error adding joke:", error);
          }
        }
      }
    }

    console.log("Jokes added successfully!");
  }
};
