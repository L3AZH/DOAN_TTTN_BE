const ShopController = require("../controllers/ShopController");
const ShopValidator = require("../validators/ShopValidator");
const jwtAuth = require("../middlewares/JwtAuth");
const AdminRole = require("../middlewares/checkrole/AdminRole");
const router = require("express").Router();

router.get("/get-all-shop", jwtAuth, ShopController.getAllShop);

router.post(
  "/create-new-shop",
  jwtAuth,
  AdminRole,
  ShopValidator.createNewShopValidation,
  ShopValidator.result,
  ShopController.createNewShop
);

router.delete(
  "/delete-shop/:idShop",
  jwtAuth,
  AdminRole,
  ShopValidator.deleteShopValidation,
  ShopValidator.result,
  ShopController.deleteShop
);

router.put(
  "/update-shop/:idShop",
  jwtAuth,
  AdminRole,
  ShopValidator.updateShopValidation,
  ShopValidator.result,
  ShopController.updateShop
);

module.exports = router;
