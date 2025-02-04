import express from "express";
import { isAuth } from "../middleware/middleware.js";
import {
  createNewGroup,
  getAllUserGroups,
  getGroupChats,
  getGroupInviteCode,
  getIdToNameAndColor,
  getIsUserNewContoller,
  getTodaysJoke,
  getTodaysQuote,
  getTypingLeaderBoard,
  isGroupNameNew,
  joinGroup,
  sendChatToGroup,
  updateMyTypingSpeed,
} from "../controllers/appController.js";

const router = express.Router();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/is-user-new", isAuth, async (req, res) => {
  await getIsUserNewContoller(req, res);
});

router.get("/is-group-name-uniq", isAuth, async (req, res) => {
  await isGroupNameNew(req, res);
});

router.post("/create-new-group", isAuth, async (req, res) => {
  await createNewGroup(req, res);
});

router.get("/get-all-user-groups", isAuth, async (req, res) => {
  await getAllUserGroups(req, res);
});

router.get("/get-group-invite-code", isAuth, async (req, res) => {
  await getGroupInviteCode(req, res);
});

router.post("/join-group", isAuth, async (req, res) => {
  await joinGroup(req, res);
});

router.get("/get-chats-of-group", isAuth, async (req, res) => {
  await getGroupChats(req, res);
});

router.post("/send-chat-to-group", isAuth, async (req, res) => {
  await sendChatToGroup(req, res);
});

router.get("/id-to-name-and-color", isAuth, async (req, res) => {
  await getIdToNameAndColor(req, res);
});
router.get("/get-todays-quote", isAuth, async (req, res) => {
  await getTodaysQuote(req, res);
});

router.get("/get-todays-joke", isAuth, async (req, res) => {
  await getTodaysJoke(req, res);
});

router.get("/get-typing-leaderboard", isAuth, async (req, res) => {
  await getTypingLeaderBoard(req, res);
});

router.put("/update-my-typing-speed", isAuth, async (req, res) => {
  updateMyTypingSpeed(req, res);
});

export default router;
