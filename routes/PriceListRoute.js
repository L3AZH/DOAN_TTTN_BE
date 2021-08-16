const PriceListController = require("../controllers/PriceListController");
const PriceListValidator = require("../validators/PriceListValidator");
const AdminRole = require("../middlewares/checkrole/AdminRole");
const jwtAuth = require("../middlewares/JwtAuth");
const router = require("express").Router();

router.get(
  "/get-all-price-list",
  jwtAuth,
  AdminRole,
  PriceListController.getAllPriceList
);

router.get(
  "/get-shop-by-id-product/:idProduct",
  jwtAuth,
  PriceListValidator.getListShopByIdProductValidation,
  PriceListValidator.result,
  PriceListController.getListShopByIdProduct
);

router.get(
  "/get-product-by-id-shop/:idShop",
  jwtAuth,
  AdminRole,
  PriceListValidator.getListProductByIdShopValidation,
  PriceListValidator.result,
  PriceListController.getListProductByIdShop
);

router.get(
  "/get-list-price-list-by-name-product/:nameProduct",
  jwtAuth,
  PriceListValidator.getListPriceListByNameProductValidation,
  PriceListValidator.result,
  PriceListController.getListPriceListByNameProduct
);

router.post(
  "/create-new-price-list-object",
  jwtAuth,
  AdminRole,
  PriceListValidator.addNewPriceListObjectValidation,
  PriceListValidator.result,
  PriceListController.addNewPriceListObject
);

router.delete(
  "/delete-price-list-object/:idShop/:idProduct",
  jwtAuth,
  AdminRole,
  PriceListValidator.deletePriceListObjectValidation,
  PriceListValidator.result,
  PriceListController.deletePriceListObject
);

router.put(
  "/update-price-list-object/:idShop/:idProduct",
  jwtAuth,
  AdminRole,
  PriceListValidator.updatePriceListObjectValidation,
  PriceListValidator.result,
  PriceListController.updatePriceListObject
);

module.exports = router;
