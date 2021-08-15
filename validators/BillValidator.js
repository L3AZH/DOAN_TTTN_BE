const { body, validationResult, param, query } = require("express-validator");
const Account = require("../database/models/Account");
const Bill = require("../database/models/Bill");
const { ErrorResponse } = require("../models/ErrorResponse");

module.exports = {
  getAllBillByIdAccountValidation: [
    param("idAccount")
      .trim()
      .notEmpty()
      .withMessage("Please enter id Account in path !!")
      .custom(async (value) => {
        const findResult = await Account.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: "Id Account not exist in database !! ",
            })
          );
        }
      })
      .custom(async (value) => {
        const findResult = await Bill.findAll({
          where: { AccountIdAccount: value },
        });
        if (findResult == null || findResult.length === 0) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: `Can't find any bill Account id: ${value}`,
            })
          );
        }
      }),
  ],
  createBillByIdAccountValidation: [
    param("idAccount")
      .trim()
      .notEmpty()
      .withMessage("Please enter id Account in path !!")
      .custom(async (value) => {
        const findResult = await Account.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: "Id Account not exist in database !! ",
            })
          );
        }
      }),
    body("date").trim().notEmpty().withMessage("Please enter date in Bill !!"),
  ],
  updateStatusBillValidation: [
    param("idBill")
      .trim()
      .notEmpty()
      .withMessage("Please enter idBill in path !!")
      .custom(async (value) => {
        const findResult = await Bill.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: "Id Bill not exist in database !!",
            })
          );
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
