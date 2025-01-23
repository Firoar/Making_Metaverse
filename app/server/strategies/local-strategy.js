import passport from "passport";
import { Strategy } from "passport-local";
import { lookInDb, lookInDbById } from "../utils/db/allDbCalls.js";
import crypto from "crypto";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await lookInDbById(id);

    if (!user) {
      throw new Error("user not found");
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await lookInDb(null, username);

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        (err, hashedPassword) => {
          if (err) return done(err, null);

          if (
            !crypto.timingSafeEqual(
              Buffer.from(user.password, "hex"),
              hashedPassword
            )
          ) {
            return done(null, false, { message: "Invalid credentials!!!!!!!" });
          }
          return done(null, user);
        }
      );
    } catch (error) {
      return done(error, null);
    }
  })
);
