const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const DetailShopProduct = require("../database/models/DetailShopProduct");
const BillDetail = require("../database/models/BillDetail");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");

exports.getAllDetailShopProduct = asyncMiddleware(async (req, res, next) => {
  const findResult = await DetailShopProduct.findAll();
  if (findResult == null || findResult.length === 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: "Can't find any DetailShopProduct in database",
      })
    );
  }
  return res.status(200).json(new SuccessResponse(200, { result: findResult }));
});

exports.getListProductByIdShop = asyncMiddleware(async (req, res, next) => {
  const idShop = req.params.idShop;
  const findResult = await DetailShopProduct.findAll({
    where: { ShopIdShop: idShop },
  });
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

exports.getListShopByIdProduct = asyncMiddleware(async (req, res, next) => {
  const idProduct = req.params.idProduct;
  const findResult = await sequelize.query(
    "select * , Product.name as nameProduct " +
      "from DetailShopProduct,Product,Shop " +
      "where DetailShopProduct.Product_idProduct = Product.idProduct and " +
      "DetailShopProduct.Shop_idShop = Shop.idShop and " +
      "DetailShopProduct.Product_idProduct = :idProductInput",
    { type: QueryTypes.SELECT, replacements: { idProductInput: idProduct } }
  );
  if (findResult == null || findResult.length === 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Can't find any shop with Product id: ${idProduct}`,
      })
    );
  } else {
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: findResult }));
  }
});

exports.getListDetailShopProductByNameProduct = asyncMiddleware(
  async (req, res, next) => {
    const nameProduct = req.params.nameProduct;
    const findResult = await sequelize.query(
      "select * , Product.name as nameProduct " +
        "from DetailShopProduct,Product,Shop " +
        "where DetailShopProduct.Product_idProduct = Product.idProduct and " +
        "DetailShopProduct.Shop_idShop = Shop.idShop and " +
        "Product.name = :nameProduct",
      { type: QueryTypes.SELECT, replacements: { nameProduct: nameProduct } }
    );
    if (findResult == null || findResult.length === 0) {
      return res.status(404).json(
        new ErrorResponse(404, {
          message: `Cant find any product with name :${nameProduct}`,
        })
      );
    } else {
      return res
        .status(200)
        .json(new SuccessResponse(200, { result: findResult }));
    }
  }
);

exports.addNewDetailShopProductObject = asyncMiddleware(
  async (req, res, next) => {
    const data = req.body;
    const findResult = await DetailShopProduct.findOne({
      where: {
        ShopIdShop: data.idShop,
        ProductIdProduct: data.idProduct,
      },
    });
    if (findResult != null) {
      return res.status(400).json(
        new ErrorResponse(400, {
          message: `DetailShopProductObejct with idshop: ${data.idShop} and idProduct: ${data.idProduct} exist in database`,
        })
      );
    }
    const resultCreate = await DetailShopProduct.create({
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
  }
);

exports.deleteDetailShopProductObject = asyncMiddleware(
  async (req, res, next) => {
    const data = req.params;
    const findResult = await DetailShopProduct.findOne({
      where: {
        ShopIdShop: data.idShop,
        ProductIdProduct: data.idProduct,
      },
    });
    if (findResult == null) {
      return res.status(404).json(
        new ErrorResponse(404, {
          message: `DetailShopProductObejct with idshop: ${data.idShop} and idProduct: ${data.idProduct} not exist in database`,
        })
      );
    }
    const checkExistInDetailBill = await BillDetail.findAll({
      where: {
        DetailShopProductShopIdShop: data.idShop,
        DetailShopProductProductIdProduct: data.idProduct,
      },
    });
    if (!(checkExistInDetailBill.length === 0)) {
      return res.status(400).json(
        new ErrorResponse(400, {
          message: `DetailShopProductObejct with idshop: ${data.idShop} and idProduct: ${data.idProduct} exist in detail bill`,
        })
      );
    }
    await DetailShopProduct.destroy({
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
  }
);

exports.updateDetailShopProductObject = asyncMiddleware(
  async (req, res, next) => {
    const idData = req.params;
    const data = req.body;
    const findResult = await DetailShopProduct.findOne({
      where: {
        ShopIdShop: idData.idShop,
        ProductIdProduct: idData.idProduct,
      },
    });
    console.log(idData);
    if (findResult == null) {
      return res.status(404).json(
        new ErrorResponse(404, {
          message: `DetailShopProductObejct with idshop: ${idData.idShop} and idProduct: ${idData.idProduct} not exist in database`,
        })
      );
    }
    // phai doi update vi qua trinh nay kha lau UI se update cai cu vi update o server chua xong !!
    await DetailShopProduct.update(
      { price: data.price, image: Buffer.from(data.image) },
      {
        where: {
          ShopIdShop: idData.idShop,
          ProductIdProduct: idData.idProduct,
        },
      }
    );
    return res.status(200).json(
      new SuccessResponse(200, {
        message: "Update DetailShopProduct Object successfully !!",
      })
    );
  }
);
