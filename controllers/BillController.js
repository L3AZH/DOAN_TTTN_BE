const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const Bill = require("../database/models/Bill");

exports.getAllBill = asyncMiddleware(async (req, res, next) => {
  const findResult = await Bill.findAll();
  if (findResult == null || findResult.length === 0) {
    return res
      .status(404)
      .json(
        new ErrorResponse(404, { message: "Can't find any Bill in database" })
      );
  } else {
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: findResult }));
  }
});

exports.getBillByIdAccount = asyncMiddleware(async (req, res, next) => {
  const idAccount = req.params.idAccount;
  const findResult = await Bill.findAll({
    where: { AccountIdAccount: idAccount },
  });
  if (findResult == null || findResult.length === 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Can't find any bill Account id: ${idAccount}`,
      })
    );
  } else {
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: findResult }));
  }
});

exports.createBillByIdAccount = asyncMiddleware(async (req, res, next) => {
  const idAccount = req.params.idAccount;
  const data = req.body;
  await Bill.create({
    date: new Date(data.date),
    status: "Pending",
    AccountIdAccount: idAccount,
  });
  return res
    .status(200)
    .json(new SuccessResponse(200, { message: "Create Bill successfully !!" }));
});

exports.updateStatusBill = asyncMiddleware(async (req, res, next) => {
  const idBill = req.params.idBill;
  await Bill.update(
    {
      status: "Confirmed",
    },
    { where: { idBill: idBill } }
  );
  return res
    .status(200)
    .json(
      new SuccessResponse(200, { message: "Comfirm Bill successfully !!" })
    );
});
