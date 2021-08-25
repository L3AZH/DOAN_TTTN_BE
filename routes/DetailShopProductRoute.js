const DetailShopProductController = require("../controllers/DetailShopProductController");
const DetailShopProductValidator = require("../validators/DetailShopProductValidator");
const AdminRole = require("../middlewares/checkrole/AdminRole");
const jwtAuth = require("../middlewares/JwtAuth");
const router = require("express").Router();

router.get(
  "/get-all-detail-shop-product",
  jwtAuth,
  AdminRole,
  DetailShopProductController.getAllDetailShopProduct
);

router.get(
  "/get-shop-by-id-product/:idProduct",
  jwtAuth,
  DetailShopProductValidator.getListShopByIdProductValidation,
  DetailShopProductValidator.result,
  DetailShopProductController.getListShopByIdProduct
);

router.get(
  "/get-product-by-id-shop/:idShop",
  jwtAuth,
  AdminRole,
  DetailShopProductValidator.getListProductByIdShopValidation,
  DetailShopProductValidator.result,
  DetailShopProductController.getListProductByIdShop
);

router.get(
  "/get-list-detail-shop-product-by-name-product/:nameProduct",
  jwtAuth,
  DetailShopProductValidator.getListDetailShopProductByNameProductValidation,
  DetailShopProductValidator.result,
  DetailShopProductController.getListDetailShopProductByNameProduct
);

router.post(
  "/create-new-detail-shop-product-object",
  jwtAuth,
  AdminRole,
  DetailShopProductValidator.addNewDetailShopProductObjectValidation,
  DetailShopProductValidator.result,
  DetailShopProductController.addNewDetailShopProductObject
);

router.delete(
  "/delete-detail-shop-product-object/:idShop/:idProduct",
  jwtAuth,
  AdminRole,
  DetailShopProductValidator.deleteDetailShopProductObjectValidation,
  DetailShopProductValidator.result,
  DetailShopProductController.deleteDetailShopProductObject
);

router.put(
  "/update-detail-shop-product-object/:idShop/:idProduct",
  jwtAuth,
  AdminRole,
  DetailShopProductValidator.updateDetailShopProductObjectValidation,
  DetailShopProductValidator.result,
  DetailShopProductController.updateDetailShopProductObject
);

module.exports = router;
