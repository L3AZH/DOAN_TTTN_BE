const { body, validationResult, param, query } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const DetailShopProduct = require("../database/models/DetailShopProduct");
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
  getListShopByIdProductValidation: [
    param("idProduct")
      .trim()
      .notEmpty()
      .withMessage("Please enter id Product in path !!")
      .custom(async (value) => {
        const findResult = await Product.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: "IdProduct not exist in databse",
            })
          );
        }
      }),
  ],
  getListDetailShopProductByNameProductValidation: [
    param("nameProduct")
      .trim()
      .notEmpty()
      .withMessage("Please enter name product to find !!"),
  ],
  addNewDetailShopProductObjectValidation: [
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
        if (value > 10000000000) {
          return Promise.reject("Price maximum: 10000000000");
        }
      }),
    body("image")
      .notEmpty()
      .withMessage("Please upload image of product !!")
      .isArray()
      .withMessage("Invalid array !!"),
  ],
  deleteDetailShopProductObjectValidation: [
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
  updateDetailShopProductObjectValidation: [
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
      .custom(async (value) => {
        if (value < 10000) {
          return Promise.reject("Price minimun: 10000");
        }
        if (value > 10000000000) {
          return Promise.reject("Price maximum: 10000000000");
        }
      }),
    body("image")
      .notEmpty()
      .withMessage("Please upload image of product !!")
      .isArray()
      .withMessage("Invalid image data"),
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
