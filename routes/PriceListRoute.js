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
  "/get-shop-by-id-product",
  jwtAuth,
  PriceListValidator.getListShopByIdProduct,
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
