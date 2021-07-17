const { ErrorResponse } = require("../../models/ErrorResponse");

const adminRole = (req, res, next) => {
  if (!req.user.role) {
    if (req.user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json(
          new ErrorResponse(
            403,
            "Premission denied: You not allowed to access this api !!"
          )
        );
    }
  } else {
    return res
      .status(500)
      .json(new ErrorResponse(500, { message: "Role check null value!" }));
  }
};

module.exports = adminRole;
