const { ErrorResponse } = require("../models/ErrorResponse");
const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decode;
      next();
    } catch (err) {
      return res
        .status(401)
        .json(new ErrorResponse(401, { message: "Unauthorized" }));
    }
  } else {
    return res
      .status(401)
      .json(
        new ErrorResponse(401, { message: "Invalid token, Accessed denied !!" })
      );
  }
};

module.exports = jwtAuth;
