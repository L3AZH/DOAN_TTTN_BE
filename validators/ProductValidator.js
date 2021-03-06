const { body, validationResult, param } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const Product = require("../database/models/Product");
const Category = require("../database/models/Category");
const BillDetail = require("../database/models/BillDetail");
const DetailShopProduct = require("../database/models/DetailShopProduct");

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
      .isLength({ max: 50 })
      .withMessage("Product name must be maximun 50 character!!")
      .custom(async (value) => {
        const findResult = await Product.findOne({ where: { name: value } });
        if (findResult != null) {
          return Promise.reject(
            `Product with name: ${value} exist in database !!`
          );
        }
      }),
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
  deleteProductValidation: [
    param("idProduct")
      .trim()
      .notEmpty()
      .withMessage("Please enter idProduct to delete Product !!")
      .custom(async (value) => {
        const findResult = await Product.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            `Product with this id: ${value} was not exist !!`
          );
        }
      })
      .custom(async (value) => {
        const findResult = await DetailShopProduct.findOne({
          where: { ProductIdProduct: value },
        });
        if (findResult != null) {
          return Promise.reject(
            `Product already exist in DetailShopProduct, can not delete !!`
          );
        }
      }),
  ],
  updateProductValidation: [
    param("idProduct")
      .trim()
      .notEmpty()
      .withMessage("Please enter idProduct to delete Product !!")
      .custom(async (value) => {
        const findResult = await Product.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            `Product with this id: ${value} was not exist !!`
          );
        }
      }),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Please enter name product !!")
      .isLength({ max: 50 })
      .withMessage("Product name must be maximun 50 character!!"),
    // .custom(async (value) => {
    //   const findResult = await Product.findOne({ where: { name: value } });
    //   if (findResult != null) {
    //     return Promise.reject(
    //       `Product with name: ${value} exist in database !!`
    //     );
    //   }
    // }),
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
