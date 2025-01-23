import crypto from "crypto";

export const generateRandomCode = (len) => {
  return crypto.randomBytes(len).toString("base64").slice(0, len);
};
