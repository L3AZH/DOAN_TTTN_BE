const { body, validationResult, param } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const Category = require("../database/models/Category");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");

module.exports = {
  createNewCategoryValidation: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Please enter name of category !!")
      .custom(async (value) => {
        const resultFind = await Category.findOne({ where: { name: value } });
        if (resultFind != null) {
          return Promise.reject(
            "Category with this name already exist in database !!"
          );
        }
      }),
  ],
  deleteCategoryValidation: [
    param("idCategory")
      .trim()
      .notEmpty()
      .withMessage("Please insert idCategory you want delete in path !!")
      .custom(async (value) => {
        const checkExist = await Category.findByPk(value);
        if (checkExist == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: `Can't find any category with id: ${value}`,
            })
          );
        }
      })
      .custom(async (value) => {
        const resultFind = await sequelize.query(
          "select * from Product where Product.Category_idCategory = :idCategory",
          {
            type: QueryTypes.SELECT,
            replacements: { idCategory: value },
          }
        );
        if (!(resultFind.length === 0)) {
          return Promise.reject(
            "This category already exist in table Product !!!"
          );
        }
      }),
  ],
  updateCategoryValidation: [
    param("idCategory")
      .trim()
      .notEmpty()
      .withMessage("Please insert idCategory you want update in path !!")
      .custom(async (value) => {
        const checkExist = await Category.findByPk(value);
        if (checkExist == null) {
          return Promise.reject(
            new ErrorResponse(404, `Can't find any category with id: ${value}`)
          );
        }
      }),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Please enter category's name !!")
      .custom(async (value) => {
        const resultFind = await Category.findOne({ where: { name: value } });
        if (resultFind != null) {
          return Promise.reject(
            "Category with this name already exist in database !!"
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
