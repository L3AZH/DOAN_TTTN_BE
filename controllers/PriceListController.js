const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const PriceList = require("../database/models/PriceList");

exports.getAllPriceList = asyncMiddleware(async (req, res, next) => {
  const findResult = await PriceList.findAll();
  if (findResult == null || findResult.length === 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: "Can't find any PriceList in database",
      })
    );
  }
  return res.status(200).json(new SuccessResponse(200, { result: findResult }));
});

exports.getListProductByIdShop = asyncMiddleware(async (req, res, next) => {
  const idShop = req.params.idShop;
  const findResult = await PriceList.findAll({ where: { ShopIdShop: idShop } });
  if (findResult == null || findResult.length === 0) {
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
  const findResult = await PriceList.findOne({
    where: {
      ShopIdShop: data.idShop,
      ProductIdProduct: data.idProduct,
    },
  });
  if (findResult != null) {
    return res.status(400).json(
      new ErrorResponse(400, {
        message: `PriceListObejct with idshop: ${data.idShop} and idProduct: ${data.idProduct} exist in database`,
      })
    );
  }
  const resultCreate = await PriceList.create({
    ShopIdShop: data.idShop,
    ProductIdProduct: data.idProduct,
    price: data.price,
    image: Buffer.from(data.image),
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
  const findResult = await PriceList.findOne({
    where: {
      ShopIdShop: data.idShop,
      ProductIdProduct: data.idProduct,
    },
  });
  if (findResult == null) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `PriceListObejct with idshop: ${data.idShop} and idProduct: ${data.idProduct} not exist in database`,
      })
    );
  }
  PriceList.destroy({
    where: {
      ProductIdProduct: data.idProduct,
      ShopIdShop: data.idShop,
    },
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "delete product in shop successfully !! ",
    })
  );
});

exports.updatePriceListObject = asyncMiddleware(async (req, res, next) => {
  const idData = req.params;
  const data = req.data;
  const findResult = await PriceList.findOne({
    where: {
      ShopIdShop: data.idShop,
      ProductIdProduct: data.idProduct,
    },
  });
  if (findResult == null) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `PriceListObejct with idshop: ${data.idShop} and idProduct: ${data.idProduct} not exist in database`,
      })
    );
  }
  PriceList.update(
    { price: data.price, image: data.image },
    {
      where: {
        ShopIdShop: idData.idShop,
        ProductIdProduct: data.idProduct,
      },
    }
  );
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Update Price List Object successfully !!",
    })
  );
});
