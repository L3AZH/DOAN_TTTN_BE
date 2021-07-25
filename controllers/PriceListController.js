const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const PriceList = require("../database/models/PriceList");

exports.getListProductByIdShop = asyncMiddleware(async (req, res, next) => {
  const idShop = req.params.idShop;
  const findResult = await PriceList.findAll({ where: { idShop: idShop } });
  if (findResult == null) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Can't find any Product with Shop id : ${idShop}`,
      })
    );
  } else {
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: findResult }));
  }
});

exports.addNewPriceListObject = asyncMiddleware(async (req, res, next) => {
  const data = req.body;
  const resultCreate = await PriceList.create({
    ShopIdShop: data.idShop,
    ProductIdProduct: data.idProduct,
    price: data.price,
    image: data.image,
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Add product to shop successfully !! ",
      newObject: resultCreate.toJSON(),
    })
  );
});

exports.deletePriceListObject = asyncMiddleware(async (req, res, next) => {
  const data = req.params;
  PriceList.destroy({
    where: {
      ProductIdProduct: data.idProduct,
      ShopIdShop: data.idShop,
    },
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "deete product in shop successfully !! ",
      newObject: resultCreate.toJSON(),
    })
  );
});
