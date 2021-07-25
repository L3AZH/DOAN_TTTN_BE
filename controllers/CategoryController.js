const Category = require("../database/models/Category");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");

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
      .json(new SuccessResponse(200, { result: findResult }));
  }
});

exports.createNewCategory = asyncMiddleware(async (req, res, next) => {
  const data = req.body;
  const createResult = await Category.create({ name: data.name });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create category successfully !!",
      newObject: createResult.toJSON(),
    })
  );
});

exports.deleteCategory = asyncMiddleware(async (req, res, next) => {
  const data = req.params;
  Category.destroy({
    where: { idCategory: data.idCategory },
  });
  return res
    .status(200)
    .json(
      new SuccessResponse(200, { message: "Delete category successfully !!" })
    );
});

exports.updateCategory = asyncMiddleware(async (req, res, next) => {
  const newName = req.body.name;
  const idCategory = req.params.idCategory;
  const resultUpdate = await Category.update(
    { name: newName },
    { where: { idCategory: idCategory } }
  );
  console.log(resultUpdate);
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Update category successfully",
    })
  );
});
