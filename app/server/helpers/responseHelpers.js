import { printErrorInGoodWay } from "../utils/printErrors.js";

export const send500ErrorResponse = (
  error = null,
  res,
  message = "Internal server Error"
) => {
  printErrorInGoodWay(error || message);
  printErrorInGoodWay(message);

  return res.status(500).json({
    ok: false,
    message: `Internal Server Error : ${
      error?.message || error?.data?.message || message
    }`,
  });
};

export const send401ErrorResponse = async (
  error = null,
  res,
  message = "Unauthorized"
) => {
  printErrorInGoodWay(error?.message || error?.data?.message || message);
  printErrorInGoodWay(message);

  return res.status(401).json({
    ok: false,
    message: message,
  });
};

export const send404ErrorResponse = (
  error = null,
  res,
  message = "Requested Resource not found"
) => {
  printErrorInGoodWay(error || message);
  printErrorInGoodWay(message);

  return res.status(404).json({
    ok: false,
    message: ` ${error?.message || error?.data?.message || message}`,
  });
};

export const send400ErrorResponse = async (
  error = null,
  res,
  message = "Invalid Data Format"
) => {
  printErrorInGoodWay(error || message);
  printErrorInGoodWay(message);

  return res.status(400).json({
    ok: false,
    message: message,
  });
};

export const send409ErrorResponse = async (
  error = null,
  res,
  message = "Conflict in the resource state.Conflict in the resource state."
) => {
  printErrorInGoodWay(error || message);
  printErrorInGoodWay(message);

  return res.status(409).json({
    ok: false,
    message: message,
  });
};
