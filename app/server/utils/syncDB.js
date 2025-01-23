import { sequelize } from "../database.js";
import "colors";
import { User } from "../models/User.js";
import { Message } from "../models/Message.js";
import { Group } from "../models/Group.js";
import {
  defineAssociation,
  fillMapTable,
  User_Group,
} from "../models/associations.js";
import { Maps } from "../models/Maps.js";
import { Quotes } from "../models/Quotes.js";
import { fillQuotesTable } from "./quotes/quotesFiller.js";
import { printErrorInGoodWay } from "./printErrors.js";
import { Jokes } from "../models/Jokes.js";
import { fillJokesTable } from "./jokes/jokesFiller.js";

export const syncTheDb = async () => {
  try {
    await sequelize.sync();
    await sequelize.authenticate();
    await User.sync({ force: false });
    await Message.sync({ force: false });
    await Group.sync({ force: false });
    await User_Group.sync({ force: false });
    await Maps.sync({ force: false });
    await Quotes.sync({ force: false });
    await Jokes.sync({ force: false });
    await fillJokesTable();
    await fillQuotesTable();
    await fillMapTable();
    await defineAssociation();

    console.log("********************");
    console.log("db synced".yellow.underline.bgBlack.bold);
    console.log("********************");
  } catch (error) {
    console.log(`Error Connecting to database`.red.bgYellow);
    printErrorInGoodWay(error);
  }
};
