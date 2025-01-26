import axios from "axios";
import {
  AreaIndex,
  Matrix,
  valueToAreaobj,
} from "../assets/finalMatrixValue.js";
import { notify } from "./toasts.js";
import store from "../store/store.js";
import {
  setEnteredGroupVideoChat,
  setEnteredLeetcodeArea,
  setEnteredPeerVideoChat,
  setEnteredTypingGameArea,
  setGroupVideoChatSeatsOccupied,
} from "../store/features/groups/groupsSlice.js";
import { getSocket } from "../services/socketService.js";
import {
  setPlayerX,
  setPlayerY,
} from "../store/features/movement/movementSlice.js";

const getQuote = async () => {
  if (localStorage.getItem("quote-of-today") !== null) {
    const storedData = JSON.parse(localStorage.getItem("quote-of-today"));
    const currentTime = new Date().getTime();
    if (currentTime - storedData.lastFetched > 20 * 60 * 1000) {
      const todayQuote = `${storedData.quote} -> ${storedData.author}`;
      notify(todayQuote);
      storedData.lastFetched = currentTime;
      localStorage.setItem("quote-of-today", JSON.stringify(storedData));
    }
    return;
  } else {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const diffInMillis = today - startOfYear;
    const daysPassed = Math.floor(diffInMillis / (1000 * 60 * 60 * 24)) + 1;

    console.log(import.meta.env.VITE_SERVER_URL, daysPassed);
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}api/get-todays-quote`,
      {
        withCredentials: true,
        params: {
          id: daysPassed,
        },
      }
    );
    if (response.data.ok) {
      const todayQuote = `${response.data.quote} -> ${response.data.author}`;
      console.log(todayQuote);
      notify(todayQuote);
      const storedData = {
        quote: response.data.quote,
        author: response.data.author,
        lastFetched: new Date().getTime(),
      };
      localStorage.setItem("quote-of-today", JSON.stringify(storedData));
    }
    try {
    } catch (error) {
      notify("There was Error while fetching today's quote", "error");
      console.log("Error : ", error);
    }
  }
};

const renderJoke = (storedJoke) => {
  if (storedJoke.joke) {
    const todaysJoke = `${storedJoke.joke}`;
    notify(todaysJoke);
  } else if (storedJoke.delivery && storedJoke.setup) {
    const todaysJoke = `${storedJoke.setup} => ${storedJoke.delivery}`;
    notify(todaysJoke);
  } else {
    notify("Something went wrong with the joke data.");
  }
};

const getJoke = async () => {
  const currentTime = new Date().getTime();

  const storedJoke = JSON.parse(localStorage.getItem("joke-of-the-day"));

  if (storedJoke) {
    if (currentTime - storedJoke.lastFetched > 1000 * 20 * 60) {
      renderJoke(storedJoke);
      storedJoke.lastFetched = currentTime;
      localStorage.setItem("joke-of-the-day", JSON.stringify(storedJoke));
    }
  } else {
    const today = new Date();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/get-todays-joke`,
        {
          params: { id: today.getDate() },
          withCredentials: true,
        }
      );

      if (response.data.ok) {
        console.log(response);
        const newJoke = {
          joke: response.data.fullJoke.joke ?? null,
          setup: response.data.fullJoke.setup ?? null,
          delivery: response.data.fullJoke.delivery ?? null,
          lastFetched: currentTime,
        };

        renderJoke(newJoke);
        localStorage.setItem("joke-of-the-day", JSON.stringify(newJoke));
      } else {
        notify("Couldn't retrieve today's joke.");
      }
    } catch (error) {
      notify("Error fetching today's joke.", "error");
      console.error(error);
    }
  }
};

const changeEnteredGroupVideoChat = () => {
  const socket = getSocket();
  const state = store.getState();
  store.dispatch(setEnteredGroupVideoChat(true));

  // also change possition to that chair
  // get all group chairs coord
  // select which has not been selected
  const allGroupVideoChairs = AreaIndex.GroupvideoChairs;

  const unOccupiedGroupVideoChairs = allGroupVideoChairs.filter(
    (arr) =>
      !state.groups.groupVideoChatSeatsOccupied.some(
        (occupiedChair) =>
          occupiedChair[0] === arr[0] && occupiedChair[1] === arr[1]
      )
  );

  const newOccupiedSeats = [
    ...state.groups.groupVideoChatSeatsOccupied,
    unOccupiedGroupVideoChairs[0],
  ];

  store.dispatch(setGroupVideoChatSeatsOccupied(newOccupiedSeats));

  store.dispatch(setPlayerX(unOccupiedGroupVideoChairs[0][1]));
  store.dispatch(setPlayerY(unOccupiedGroupVideoChairs[0][0]));

  const data = {
    groupId: state.groups.selectedGroup.id,
    groupName: state.groups.selectedGroup.name,
    posX: unOccupiedGroupVideoChairs[0][1],
    posY: unOccupiedGroupVideoChairs[0][0],
  };
  socket.emit("i-moved", data);
};

const changeEnteredPeerVideoChat = () => {
  store.dispatch(setEnteredPeerVideoChat(true));
};

const changeEnteredLeetcodeArea = () => {
  store.dispatch(setEnteredLeetcodeArea(true));
};

const changeEnteredTypingGameArea = () => {
  store.dispatch(setEnteredTypingGameArea(true));
};

export const checkBoundary = (x, y, valX = 0, valY = 0) => {
  if (x + valX <= 22 && y + valY <= 21) return true;
  if (x + valX >= 38 && y + valY <= 21) return true;

  const val = Matrix[valY + y][valX + x];

  switch (val) {
    case 568:
      return true;
    case 537:
      return true;
    case 519:
      alert("this is typing race leaderboard");
      break;
    case 586:
      // alert("This spwans random joke");
      getJoke();
      break;
    case 1055:
      // notify("this is a random quote", "success");
      getQuote();
      break;
    case 1050:
      alert("This is coding contest leaderboard");
      break;
    case 77:
      alert("You entered competative coding contest area");
      break;
    case 21:
      changeEnteredTypingGameArea();
      break;
    case 518:
      changeEnteredGroupVideoChat();
      return true;
      break;
    case 543:
      // alert("you entered peer video door");
      changeEnteredPeerVideoChat();
      return true;
      break;
    case 229:
      // alert("you entered competative programming contest door");
      changeEnteredLeetcodeArea();
      break;
    case 18:
      alert("you entered typing contest area!");
      break;
    default:
      break;
  }

  return false;
};
/*

 519: "raceLeaderBoard",
  586: "jokeARea",
  568: "borderWalls",
  537: "GroupvideoChairs",
  905: "peerVideoChairs",
  1055: "quotationARea",
  1050: "ContestLeaderboard",
  979: "spawnarea",
  77: "contestareamark",
  21: "doorRace",
  518: "doorGroupVideo",
  543: "doorPeerVideo",
  229: "doorContest",
  18: "contestarea"

*/
