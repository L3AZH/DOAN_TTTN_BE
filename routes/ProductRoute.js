const ProductController = require("../controllers/ProductController");
const ProductValidator = require("../validators/ProductValidator");
const AdminRole = require("../middlewares/checkrole/AdminRole");
const jwtAuth = require("../middlewares/JwtAuth");
const { route } = require("./AuthRoute");
const router = require("express").Router();

router.get("/get-all-product", jwtAuth, ProductController.getAllProduct);

router.get(
  "/get-product-by-id-category/:idCategory",
  jwtAuth,
  AdminRole,
  ProductValidator.getProductByCategoryIdValidation,
  ProductValidator.result,
  ProductController.getProductByCategoryId
);

router.post(
  "/create-new-product",
  jwtAuth,
  AdminRole,
  ProductValidator.createNewProductValidation,
  ProductValidator.result,
  ProductController.createNewProduct
);

router.delete(
  "/delete-product/:idProduct",
  jwtAuth,
  AdminRole,
  ProductValidator.deleteProductValidation,
  ProductValidator.result,
  ProductController.deleteProduct
);

router.put(
  "/update-product/:idProduct",
  jwtAuth,
  AdminRole,
  ProductValidator.updateProductValidation,
  ProductValidator.result,
  ProductController.updateProduct
);
