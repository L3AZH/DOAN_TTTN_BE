const { body, param, validationResult } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const Account = require("../database/models/Account");
const RefreshToken = require("../database/models/RefreshToken");

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
      .withMessage("Please enter your password")
      .custom(async (value) => {
        if (value.length < 5) {
          return Promise.reject("password must be at least 5 character");
        }
      }),
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
    body("address").trim().notEmpty().withMessage("Please enter your address"),
    body("phone")
      .trim()
      .isNumeric()
      .withMessage("Phone numeber invalid")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be 10 digit"),
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
  refreshTokenValidation: [
    body("refreshToken")
      .trim()
      .notEmpty()
      .withMessage("Please enter your token !!")
      .custom(async (value) => {
        const findResult = await RefreshToken.findOne({
          where: { refreshToken: value },
        });
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(401, { message: "Invalid token !!" })
          );
        }
      }),
  ],
  changePasswordValidation: [
    param("idAccount")
      .notEmpty()
      .withMessage("Please enter idAccount !!")
      .custom(async (value) => {
        const checkExist = await Account.findByPk(value);
        if (checkExist == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: `Can't find any Account with idAccount: ${value}`,
            })
          );
        }
      }),
    body("oldPassword")
      .notEmpty()
      .withMessage("Please enter your old password !!"),
    body("newPassword")
      .notEmpty()
      .withMessage("Please enter new password")
      .custom(async (value) => {
        if (value.length < 5) {
          return Promise.reject("password must be at least 5 character");
        }
      }),
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
