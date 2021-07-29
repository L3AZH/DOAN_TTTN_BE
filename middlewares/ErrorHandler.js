const { ErrorResponse } = require("../models/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  console.log(err.name);
  console.log(err.message);

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  return res
    .status(err.statusCode)
    .json(new ErrorResponse(err.statusCode, { message: err.message }));
};

module.exports = errorHandler;
