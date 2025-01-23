import express from "express";
import { isAuth } from "../middleware/middleware.js";

const router = express.Router();

router.get("/", isAuth, (req, res) => {
  res.status(200).json({
    ok: true,
    message: `Welcome, user with ID: ${req.user.id}`,
  });
});

export default router;
