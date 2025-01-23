import crypto from "crypto";
import { lookInDb } from "../utils/db/allDbCalls.js";
import { User } from "../models/User.js";
import passport from "passport";
import {
  send400ErrorResponse,
  send401ErrorResponse,
  send409ErrorResponse,
  send500ErrorResponse,
} from "../helpers/responseHelpers.js";

export const signUpController = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return send400ErrorResponse(
      null,
      res,
      "email, username, and password are required"
    );
  }

  try {
    const existingUser = await lookInDb(email, username);

    if (existingUser) {
      if (existingUser.email === email) {
        return send409ErrorResponse(
          null,
          res,
          "An account with this email already exists"
        );
      }
      if (existingUser.username === username) {
        return send409ErrorResponse(
          null,
          res,
          "An account with this username already exists"
        );
      }
    }
  } catch (error) {
    return send500ErrorResponse(error, res, " while looking in database");
  }

  const salt = crypto.randomBytes(16).toString("hex");

  crypto.pbkdf2(
    password,
    salt,
    310000,
    32,
    "sha256",
    async (err, hashedPassword) => {
      if (err) {
        return send500ErrorResponse(
          err,
          res,
          "Couldn't hash the password. Internal server error."
        );
      }

      try {
        await User.create({
          username: username,
          email: email,
          password: hashedPassword.toString("hex"),
          salt: salt,
        });

        return res.status(201).json({
          ok: true,
          message: "Successfully created the account",
        });
      } catch (error) {
        return send500ErrorResponse(
          error,
          res,
          "while creating user => SignUp"
        );
      }
    }
  );
};

// Signin Controller

export const signInController = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: "username and password are required",
    });
  }

  // Use Passport's authenticate method
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return send500ErrorResponse(
        null,
        res,
        "Internal server error during authentication"
      );
    }

    if (!user) {
      return send401ErrorResponse(
        null,
        res,
        info.message || "Invalid Credentials"
      );
    }

    try {
      user.online = true;
      user.save();
    } catch (error) {
      return send500ErrorResponse(error, res, "Error updating user status ");
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return send500ErrorResponse(null, res, "Error during Login");
      }

      return res.status(200).json({
        ok: true,
        message: "Successfully signed in",
      });
    });
  })(req, res, next);
};
