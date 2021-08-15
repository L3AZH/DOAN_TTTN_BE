const { body, validationResult, param, query } = require("express-validator");
const Bill = require("../database/models/Bill");
const Product = require("../database/models/Product");
const Shop = require("../database/models/Shop");
const { ErrorResponse } = require("../models/ErrorResponse");

module.exports = {
  getAllBillDetailByIdBillValidation: [
    param("idBill")
      .trim()
      .notEmpty()
      .withMessage("Please input IdBill in path !!")
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
  createNewBillDetailValidation: [
    body("idBill")
      .trim()
      .notEmpty()
      .withMessage("Please enter Bill id !!")
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
    body("idShop")
      .trim()
      .notEmpty()
      .withMessage("Please enter idShop !!")
      .custom(async (value) => {
        const findResult = await Shop.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, { message: "IdShop not exist in database" })
          );
        }
      }),
    body("idProduct")
      .trim()
      .notEmpty()
      .withMessage("Please enter idProduct !!")
      .custom(async (value) => {
        const findResult = await Product.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: "IdProduct not exist in database",
            })
          );
        }
      }),
    body("price")
      .trim()
      .notEmpty()
      .withMessage("Please enter price !!")
      .isNumeric()
      .withMessage("Invalid price !!")
      .custom(async (value) => {
        if (value < 10000) {
          return Promise.reject("Price minimun: 10000");
        }
      }),
    body("amount")
      .trim()
      .notEmpty()
      .withMessage("Please enter amount !!")
      .isNumeric()
      .withMessage("Amount Invalid !!")
      .custom(async (value) => {
        if (value == 0) {
          return Promise.reject("Amount must at least 1 ");
        }
      }),
  ],
  createNewListBillDetailValidation: [
    body("listData.*.idBill")
      .notEmpty()
      .withMessage("Please enter Bill id !!")
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
    body("listData.*.idShop")
      .notEmpty()
      .withMessage("Please enter idShop !!")
      .custom(async (value) => {
        const findResult = await Shop.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, { message: "IdShop not exist in database" })
          );
        }
      }),
    body("listData.*.idProduct")
      .notEmpty()
      .withMessage("Please enter idProduct !!")
      .custom(async (value) => {
        const findResult = await Product.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: "IdProduct not exist in database",
            })
          );
        }
      }),
    body("listData.*.price")
      .notEmpty()
      .withMessage("Please enter price !!")
      .isNumeric()
      .withMessage("Invalid price !!")
      .custom(async (value) => {
        if (value < 10000) {
          return Promise.reject("Price minimun: 10000");
        }
      }),
    body("listData.*.amount")
      .notEmpty()
      .withMessage("Please enter amount !!")
      .isNumeric()
      .withMessage("Amount Invalid !!")
      .custom(async (value) => {
        if (value == 0) {
          return Promise.reject("Amount must at least 1 ");
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
