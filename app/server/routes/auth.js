import express from "express";
import {
  signInController,
  signUpController,
} from "../controllers/authControllers.js";
import {
  send401ErrorResponse,
  send500ErrorResponse,
} from "../helpers/responseHelpers.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const isSignIn = req.query.signin;

  if (isSignIn === "true") {
    await signInController(req, res);
  } else {
    await signUpController(req, res);
  }
});

router.post("/logout", async (req, res) => {
  if (!req.user) {
    return send401ErrorResponse(null, res, "Unauthorized");
  }

  try {
    req.user.online = false;
    await req.user.save();
    req.logOut((err) => {
      if (err) {
        return send500ErrorResponse(err, res, "Logout failed");
      }
      return res.status(201).json({
        ok: true,
        message: "Logout succesfull",
      });
    });
  } catch (error) {
    return send500ErrorResponse(error, res, "Error updating user status");
  }
});

export default router;
