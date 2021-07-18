const { body, validationResult, param } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const Product = require("../database/models/Product");
const Category = require("../database/models/Category");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");

module.exports = {
  getProductByCategoryIdValidation: [
    param("idCategory")
      .trim()
      .notEmpty()
      .withMessage("Please enter category id in path !!")
      .custom(async (value) => {
        const findResult = await Category.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: `Category with this id: ${value} was not exist !!`,
            })
          );
        }
      }),
  ],
  createNewProductValidation: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Please enter name product !!")
      .custom(async (value) => {
        const findResult = await Product.findOne({ where: { name: value } });
        if (findResult != null) {
          return Promise.reject(
            `Product with name: ${value} exist in database !!`
          );
        }
      }),
    body("price")
      .trim()
      .notEmpty()
      .withMessage("Please enter price product !!")
      .isNumeric()
      .withMessage("Invalid price !!"),
    body("image")
      .notEmpty()
      .withMessage("Please insert image of product !!")
      .isArray()
      .withMessage("Invalid image data !!"),
    body("idCategory")
      .trim()
      .notEmpty()
      .withMessage("Please enter idCategory !!")
      .custom(async (value) => {
        const findResult = await Category.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            `Category with this id: ${value} was not exist !!`
          );
        }
      }),
  ],
  deleteProductValidation: [],
  updateProductValidation: [],
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
