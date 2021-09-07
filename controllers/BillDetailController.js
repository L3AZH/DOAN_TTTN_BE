const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const BillDetail = require("../database/models/BillDetail");
const DetailShopProduct = require("../database/models/DetailShopProduct");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");
const { EmailService } = require("../service/EmailService");
const Bill = require("../database/models/Bill");
const Account = require("../database/models/Account");

exports.getAllBillDetailByIdBill = asyncMiddleware(async (req, res, next) => {
  const idBill = req.params.idBill;
  const findResult = await sequelize.query(
    "select Bill_idBill, DetailShopProduct_Shop_idShop, DetailShopProduct_Product_idProduct, " +
      "DetailShopProduct.price as PriceOrigin ,BillDetail.amount,  " +
      "Product.name as nameProduct, Shop.name as nameShop, DetailShopProduct.image " +
      "from BillDetail, DetailShopProduct, Product, Shop " +
      "where BillDetail.DetailShopProduct_Shop_idShop = DetailShopProduct.Shop_idShop and " +
      "BillDetail.DetailShopProduct_Product_idProduct = DetailShopProduct.Product_idProduct and " +
      "DetailShopProduct.Shop_idShop = Shop.idShop and DetailShopProduct.Product_idProduct = Product.idProduct and " +
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
    DetailShopProductShopIdShop: data.idShop,
    DetailShopProductProductIdProduct: data.idProduct,
    amount: data.amount,
  });
  const findResult = await DetailShopProduct.findOne({
    where: {
      ShopIdShop: data.idShop,
      ProductIdProduct: data.idProduct,
    },
  });
  if (findResult == null) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message:
          "This Product by This Shop not exist in DetailShopProduct database !!",
      })
    );
  } else {
    return res.status(200).json(
      new SuccessResponse(200, {
        message: "Create Bill detail successfully!!",
      })
    );
  }
});

exports.createNewListBillDetail = asyncMiddleware(async (req, res, next) => {
  const listData = req.body.listData;
  for (let index = 0; index < listData.length; index++) {
    const findResult = await DetailShopProduct.findAll({
      ShopIdShop: listData[index].idShop,
      ProductIdProduct: listData[index].idProduct,
    });
    if (findResult == null || findResult.length === 0) {
      return res.status(404).json(
        new ErrorResponse(404, {
          message:
            `Can't find any DetailShopProduct ` +
            `with idProduct: ${listData[index].idProduct} ` +
            `and idShop: ${listData[index].idShop}`,
        })
      );
    }
    await BillDetail.create({
      BillIdBill: listData[index].idBill,
      DetailShopProductShopIdShop: listData[index].idShop,
      DetailShopProductProductIdProduct: listData[index].idProduct,
      amount: listData[index].amount,
    });
  }
  const idBill = listData[0].idBill;
  const findNewBill = await sequelize.query(
    "select Bill_idBill, DetailShopProduct_Shop_idShop, DetailShopProduct_Product_idProduct, " +
      "DetailShopProduct.price as PriceOrigin ,BillDetail.amount,  " +
      "Product.name as nameProduct, Shop.name as nameShop, DetailShopProduct.image " +
      "from BillDetail, DetailShopProduct, Product, Shop " +
      "where BillDetail.DetailShopProduct_Shop_idShop = DetailShopProduct.Shop_idShop and " +
      "BillDetail.DetailShopProduct_Product_idProduct = DetailShopProduct.Product_idProduct and " +
      "DetailShopProduct.Shop_idShop = Shop.idShop and DetailShopProduct.Product_idProduct = Product.idProduct and " +
      "BillDetail.Bill_idBill = :idBillInput",
    { type: QueryTypes.SELECT, replacements: { idBillInput: idBill } }
  );
  const billFindResult = await Bill.findByPk(idBill);
  const emailCustomer = await Account.findByPk(billFindResult.AccountIdAccount);
  EmailService.init();
  await EmailService.sendInvoiceEmail(
    emailCustomer.email,
    "Your order is pending",
    "Thank you for shopping at our store",
    findNewBill,
    next
  );
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create new List Bill detail successfully !!",
    })
  );
});
