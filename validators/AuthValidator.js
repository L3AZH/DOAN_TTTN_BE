const { body, validationResult } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const Account = require("../database/models/Account");

module.exports = {
  accountRegisterDataValidation: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email !!")
      .notEmpty()
      .withMessage("Please enter your email !!")
      .custom(async (value) => {
        const dataFindResult = await Account.findOne({
          where: {
            email: value,
          },
        });
        if (dataFindResult != null) {
          return Promise.reject("Email has already used!!");
        }
      }),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter your password"),
    body("role")
      .trim()
      .notEmpty()
      .withMessage("Please pick your role before register !!")
      .custom(async (value) => {
        if (value != "admin") {
          if (value != "guest") {
            return Promise.reject("Invalid Role !!");
          }
        }
      }),
  ],
  loginRequestDataValidation: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email !!")
      .notEmpty()
      .withMessage("Please enter your email !!"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter your password"),
  ],
  result: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (errors.array()[0].msg.code == null) {
        return res
          .status(400)
          .json(new ErrorResponse(400, { message: errors.array()[0].msg }));
      } else {
        return res
          .status(errors.array()[0].msg.code)
          .json(errors.array()[0].msg);
      }
    }
    next();
  },
};
