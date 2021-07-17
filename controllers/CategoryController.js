const Category = require("../database/models/Category");
const sequelize = require("../database/Db_connection");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const { QueryTypes } = require("sequelize");

exports.getAllCategory = asyncMiddleware(async (req, res, next) => {
  const findResult = await Category.findAll();
  if (findResult == null || findResult.length === 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: "Can't find any category in database",
      })
    );
  } else {
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: findResult.toJSON() }));
  }
});

exports.createNewCategory = asyncMiddleware(async (req, res, next) => {
  const data = req.body;
  const checkNameExist = await Category.findOne({ where: { name: data.name } });
  if (checkNameExist) {
    return res.status(400).json(
      new ErrorResponse(400, {
        message:
          "This Category already exist in database please choose another name !!",
      })
    );
  } else {
    const createResult = await Category.create({ name: data.name });
    return res.status(200).json(200, {
      message: "Create category successfully !!",
      newObject: createResult.toJSON(),
    });
  }
});

exports.deleteCategory = asyncMiddleware(async (req, res, next) => {
  const data = req.params;
  const checkExistInAnotherTable = await sequelize.query(
    "select * from Product where Product.Category_idCategory = :idCategory",
    { type: QueryTypes.SELECT, replacements: { idCategory: data.idCategory } }
  );
  if (checkExistInAnotherTable) {
    return res.status(400).json(
      new ErrorResponse(400, {
        message:
          "Delete Failed: This category already exist in table Product !!!",
      })
    );
  } else {
    Category.destroy({
      where: { idCategory: data.idCategory },
    });
    return res
      .status(200)
      .json(
        new SuccessResponse(200, { message: "Delete category successfully !!" })
      );
  }
});

exports.updateCategory = asyncMiddleware(async (req, res, next) => {
  const newName = req.body;
  const idCategory = req.params.idCategory;
});
