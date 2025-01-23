export const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    ok: false,
    message: "Unauthorized. Please log in to access this resource!!!.",
  });
};
