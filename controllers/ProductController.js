const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const Product = require("../database/models/Product");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");
const _ = require("lodash");

exports.getAllProduct = asyncMiddleware(async (req, res, next) => {
  const findResult = await Product.findAll();
  if (findResult == null || findResult.length === 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: "Can't find any Product in database !!",
      })
    );
  } else {
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: findResult }));
  }
});

exports.getProductByCategoryId = asyncMiddleware(async (req, res, next) => {
  const idCategory = req.params.idCategory;
  const findResult = await Product.findAll({
    where: { CategoryIdCategory: idCategory },
  });
  if (findResult == null || findResult.length === 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Can't find any Product with category id: ${idCategory}`,
      })
    );
  } else {
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: findResult }));
  }
});

exports.createNewProduct = asyncMiddleware(async (req, res, next) => {
  const data = req.body;
  const createResult = await Product.create({
    name: data.name,
    price: data.price,
    image: data.image,
    CategoryIdCategory: data.idCategory,
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create new Product successfully !!",
      newObject: createResult.toJSON(),
    })
  );
});

exports.deleteProduct = asyncMiddleware(async (rqe, res, next) => {
  const idProduct = req.params.idCategory;
  Product.destroy({ where: { idProduct: idProduct } });
  return res
    .status(200)
    .json(
      new SuccessResponse(200, { message: "Delete Product successfully !!" })
    );
});

exports.updateProduct = asyncMiddleware(async (req, res, next) => {
  const idProduct = req.params.idCategory;
  const data = req.body;
  const updateResult = await Product.update(
    {
      name: data.name,
      CategoryIdCategory: data.idCategory,
    },
    { where: { idProduct: idProduct } }
  );
  console.log(updateResult);
  return res
    .status(200)
    .json(new SuccessResponse(200, { message: "Update product successfully" }));
});
