const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const BillDetail = require("../database/models/BillDetail");
const PriceList = require("../database/models/PriceList");

exports.getAllBillDetailByIdBill = asyncMiddleware(async (req, res, next) => {
  const idBill = req.params.idBill;
  const findResult = await BillDetail.findAll({
    where: { BillIdBill: idBill },
  });
  if (findResult == null || findResult.length === 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Can't find any Bill detail with Bill id: ${idBill}`,
      })
    );
  } else {
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: findResult }));
  }
});

exports.createNewBillDetail = asyncMiddleware(async (req, res, next) => {
  const data = req.body;
  await BillDetail.create({
    BillIdBill: data.idBill,
    PriceListShopIdShop: data.idShop,
    PriceListProductIdProduct: data.idProduct,
    price: data.price,
    amount: data.amount,
  });
  const findResult = await PriceList.findOne({
    where: {
      ShopIdShop: data.idShop,
      ProductIdProduct: data.idProduct,
    },
  });
  if (findResult == null) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: "This Product by This Shop not exist in PriceList database !!",
      })
    );
  } else {
    return res.status(200).json(
      new SuccessResponse(200, {
        message: "Create Bill detail successfully !!",
      })
    );
  }
});
