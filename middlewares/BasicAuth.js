const { ErrorResponse } = require("../models/ErrorResponse");

const basicAuth = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Basic")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decode = new Buffer.from(token, "base64").toString();
    if (
      !(
        decode ===
        `${process.env.BASICAUTH_USER}:${process.env.BASICAUTH_PASSWORD}`
      )
    ) {
      return res
        .status(401)
        .json(new ErrorResponse(401, { message: "Invalid token !!" }));
    } else {
      next();
    }
  } else {
    return res
      .status(401)
      .json(
        new ErrorResponse(401, { message: "Invalid token, Access denied !!" })
      );
  }
};

module.exports = basicAuth;
