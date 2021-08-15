const BillDetailController = require("../controllers/BillDetailController");
const BillDetailValidator = require("../validators/DetailBillValidator");
const router = require("express").Router();
const jwtAuth = require("../middlewares/JwtAuth");
const AdminRole = require("../middlewares/checkrole/AdminRole");

router.get(
  "/get-bill-detail/:idBill",
  jwtAuth,
  BillDetailValidator.getAllBillDetailByIdBillValidation,
  BillDetailValidator.result,
  BillDetailController.getAllBillDetailByIdBill
);

router.get(
  "/get-all-bill-detail",
  jwtAuth,
  AdminRole,
  BillDetailController.getAllBillDetailByIdBill
);

router.post(
  "/create-new-bill-detail",
  jwtAuth,
  BillDetailValidator.createNewBillDetailValidation,
  BillDetailValidator.result,
  BillDetailController.createNewBillDetail
);

router.post(
  "/create-new-list-bill-detail",
  jwtAuth,
  BillDetailValidator.createNewListBillDetailValidation,
  BillDetailValidator.result,
  BillDetailController.createNewListBillDetail
);

module.exports = router;
