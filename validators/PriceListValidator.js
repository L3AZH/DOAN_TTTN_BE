const { body, validationResult, param, query } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const PriceList = require("../database/models/PriceList");
const Shop = require("../database/models/Shop");
const Product = require("../database/models/Product");

module.exports = {
  getListProductByIdShopValidation: [
    param("idShop")
      .trim()
      .notEmpty()
      .withMessage("Please enter id Shop in path !!")
      .custom(async (value) => {
        const findResult = await Shop.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, { message: "IdShop not exist in database" })
          );
        }
      }),
  ],
  addNewPriceListObjectValidation: [
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
      .isLength({ min: 10000 })
      .withMessage("Price minimum : 10000"),
    body("image")
      .trim()
      .notEmpty()
      .withMessage("Please upload image of product !!")
      .isArray()
      .withMessage("Invalid image data")
      .custom(async (value) => {
        for (let i = 0; i < value.lenght; i++) {
          if (!(i === 0)) {
            return Promise.reject("Invalida image data");
          }
          if (!(i === 1)) {
            return Promise.reject("Invalida image data");
          }
        }
      }),
  ],
  deletePriceListObjectValidation: [
    param("idShop")
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
    param("idProduct")
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
  ],
  updatePriceListObjectValidation: [
    param("idShop")
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
    param("idProduct")
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
      .isLength({ min: 10000 })
      .withMessage("Price minimum : 10000"),
    body("image")
      .trim()
      .notEmpty()
      .withMessage("Please upload image of product !!")
      .isArray()
      .withMessage("Invalid image data")
      .custom(async (value) => {
        for (let i = 0; i < value.lenght; i++) {
          if (!(i === 0)) {
            return Promise.reject("Invalida image data");
          }
          if (!(i === 1)) {
            return Promise.reject("Invalida image data");
          }
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