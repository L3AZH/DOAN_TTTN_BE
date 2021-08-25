const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Account = require("../database/models/Account");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../database/models/RefreshToken");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(parseInt(process.env.DB_NUMBERSALT));
  return bcrypt.hash(password, salt);
}

exports.register = asyncMiddleware(async (req, res, next) => {
  const data = req.body;
  const createResult = await Account.create({
    email: data.email,
    password: await hashPassword(data.password),
    role: data.role,
    address: data.address,
    phone: data.phone,
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create account successfully !!",
      newObject: _.omit(createResult.toJSON(), ["password"]),
    })
  );
});

exports.login = asyncMiddleware(async (req, res, next) => {
  const data = req.body;
  const checkExistEmail = await Account.findOne({
    where: {
      email: data.email,
    },
  });
  if (checkExistEmail != null) {
    const checkPassword = await bcrypt.compare(
      data.password,
      checkExistEmail.password
    );
    if (checkPassword) {
      const token = checkExistEmail.generateToken();
      const refreshToken = checkExistEmail.generateRefreshToken();
      RefreshToken.create({ refreshToken: refreshToken });
      return res.status(200).json(
        new SuccessResponse(200, {
          message: `Login successfully with email: ${checkExistEmail.email}`,
          idAccount: checkExistEmail.idAccount,
          role: checkExistEmail.role,
          token: token,
          refreshToken: refreshToken,
        })
      );
    } else {
      return res.status(400).json(
        new ErrorResponse(400, {
          message: "Email or password was not right !!",
        })
      );
    }
  } else {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: "Not found this email, check again !!",
      })
    );
  }
});

exports.refreshToken = asyncMiddleware(async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, data) => {
      console.log(err);
      if (err)
        return res
          .status(403)
          .json(
            new ErrorResponse(403, { message: "Unthorization", error: err })
          );
      else {
        const account = await Account.findByPk(data.id);
        const token = account.generateToken();
        return res.status(200).json(new SuccessResponse(200, { token: token }));
      }
    }
  );
});

exports.checkTokenExpire = asyncMiddleware(async (req, res, next) => {
  return res.status(200).json(new SuccessResponse(200, {}));
});

exports.changePassword = asyncMiddleware(async (req, res, next) => {
  const idAccount = req.params.idAccount;
  const data = req.body;
  const account = await Account.findOne({ where: { idAccount: idAccount } });
  const checkPasswordValid = await bcrypt.compare(
    data.oldPassword,
    account.password
  );
  if (checkPasswordValid) {
    await Account.update(
      { password: await hashPassword(data.newPassword) },
      { where: { idAccount: account.idAccount } }
    );
    return res
      .status(200)
      .json(
        new SuccessResponse(200, { message: "Update password successfully !!" })
      );
  } else {
    return res
      .status(400)
      .json(new ErrorResponse(400, { message: "Wrong password !!!" }));
  }
});
