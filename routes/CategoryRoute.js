const CategoryController = require("../controllers/CategoryController");
const CategoryValidator = require("../validators/CategoryValidator");
const router = require("express").Router();
const jwtAuth = require("../middlewares/JwtAuth");
const AdminRole = require("../middlewares/checkrole/AdminRole");

router.get("/get-all-category", jwtAuth, CategoryController.getAllCategory);

router.post(
  "/create-new-category",
  jwtAuth,
  AdminRole,
  CategoryValidator.createNewCategoryValidation,
  CategoryValidator.result,
  CategoryController.createNewCategory
);

router.delete(
  "/delete-category/:idCategory",
  jwtAuth,
  AdminRole,
  CategoryValidator.deleteCategoryValidation,
  CategoryValidator.result,
  CategoryController.deleteCategory
);

router.put(
  "/update-category/:idCategory",
  jwtAuth,
  AdminRole,
  CategoryValidator.updateCategoryValidation,
  CategoryValidator.result,
  CategoryController.updateCategory
);

module.exports = router;
