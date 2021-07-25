const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const Shop = require("../database/models/Shop");

exports.getAllShop = asyncMiddleware(async (req, res, next) => {
  const findResult = await Shop.findAll();
  if (findResult == null || findResult.length === 0) {
    return res
      .status(404)
      .json(
        new ErrorResponse(404, { message: "Can't find any shop in database" })
      );
  } else {
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: findResult }));
  }
});

exports.createNewShop = asyncMiddleware(async (req, res, next) => {
  const data = req.body;
  const createResult = await Shop.create({
    name: data.name,
    address: data.address,
    phone: data.phone,
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create shop successfully !!",
      newObject: createResult.toJSON(),
    })
  );
});

exports.deleteShop = asyncMiddleware(async (req, res, next) => {
  const data = req.params;
  Shop.destroy({
    where: { idShop: data.idShop },
  });
  return res
    .status(200)
    .json(
      new SuccessResponse(200, { message: "Delete shope successfully !!" })
    );
});

exports.updateShop = asyncMiddleware(async (req, res, next) => {
  const idShop = req.params.idShop;
  const data = res.body;
  const resultUpdate = await Shop.update(
    {
      name: data.name,
      address: data.address,
      phone: data.phone,
    },
    { where: { idShop: idShop } }
  );
  console.log(resultUpdate);
  return res
    .status(200)
    .json(new SuccessResponse(200, { message: "Update shop successfully !!" }));
});
