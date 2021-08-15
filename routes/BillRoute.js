const BillController = require("../controllers/BillController");
const BillValidator = require("../validators/BillValidator");
const router = require("express").Router();
const jwtAuth = require("../middlewares/JwtAuth");
const AdminRole = require("../middlewares/checkrole/AdminRole");

router.get(
  "/get-bill-by-id-account/:idAccount",
  jwtAuth,
  BillValidator.getAllBillByIdAccountValidation,
  BillValidator.result,
  BillController.getBillByIdAccount
);

router.get("/get-all-bill", jwtAuth, AdminRole, BillController.getAllBill);

router.post(
  "/create-new-bill/:idAccount",
  jwtAuth,
  BillValidator.createBillByIdAccountValidation,
  BillValidator.result,
  BillController.createBillByIdAccount
);

router.put(
  "/update-bill/:idBill",
  jwtAuth,
  BillValidator.updateStatusBillValidation,
  BillValidator.result,
  BillController.updateStatusBill
);

module.exports = router;
