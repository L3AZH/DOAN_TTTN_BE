const asyncMiddleware = require("../middlewares/AsyncMiddleware");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Account = require("../database/models/Account");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const jwt = require("jsonwebtoken");

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
      Account.update(
        { refreshToken: refreshToken },
        { where: { idAccount: checkExistEmail.idAccount } }
      );
      return res.status(200).json(
        new SuccessResponse(200, {
          message: `Login successfully with email: ${checkExistEmail.email}`,
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
  return res.status(200).json();
});
