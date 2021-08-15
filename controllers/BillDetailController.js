const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const BillDetail = require("../database/models/BillDetail");
const PriceList = require("../database/models/PriceList");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");

exports.getAllBillDetailByIdBill = asyncMiddleware(async (req, res, next) => {
  const idBill = req.params.idBill;
  const findResult = await sequelize.query(
    "select Bill_idBill, PriceList_Shop_idShop, PriceList_Product_idProduct, " +
      "BillDetail.price as PriceDetail, PriceList.price as PriceOrigin ,BillDetail.amount,  " +
      "Product.name as nameProduct, Shop.name as nameShop, PriceList.image " +
      "from BillDetail, PriceList, Product, Shop " +
      "where BillDetail.PriceList_Shop_idShop = PriceList.Shop_idShop and " +
      "BillDetail.PriceList_Product_idProduct = PriceList.Product_idProduct and " +
      "PriceList.Shop_idShop = Shop.idShop and PriceList.Product_idProduct = Product.idProduct and " +
      "BillDetail.Bill_idBill = :idBillInput",
    { type: QueryTypes.SELECT, replacements: { idBillInput: idBill } }
  );
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

exports.createNewListBillDetail = asyncMiddleware(async (req, res, next) => {
  const listData = req.body.listData;
  for (let index = 0; index < listData.length; index++) {
    const findResult = await PriceList.findOne({
      ShopIdShop: listData[index].idShop,
      ProductIdProduct: listData[index].idProduct,
    });
    if (findResult == null) {
      return res.status(404).json(
        new ErrorResponse(404, {
          message:
            `Can't find any PriceList ` +
            `with idProduct: ${listData[index].idProduct} ` +
            `and idShop: ${listDatap[index].idShop}`,
        })
      );
    }
    await BillDetail.create({
      BillIdBill: listData[index].idBill,
      PriceListShopIdShop: listData[index].idShop,
      PriceListProductIdProduct: listData[index].idProduct,
      price: listData[index].price,
      amount: listData[index].amount,
    });
  }
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create new List Bill detail successfully !!",
    })
  );
});
