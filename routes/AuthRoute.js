const AuthValidator = require("../validators/AuthValidator");
const AuthController = require("../controllers/AuthController");
const router = require("express").Router();
const basicAuth = require("../middlewares/BasicAuth");
router.post(
  "/register",
  basicAuth,
  AuthValidator.accountRegisterDataValidation,
  AuthValidator.result,
  AuthController.register
);

router.post(
  "/login",
  basicAuth,
  AuthValidator.loginRequestDataValidation,
  AuthValidator.result,
  AuthController.login
);

router.post(
  "/refresh-token",
  basicAuth,
  AuthValidator.refreshTokenValidation,
  AuthValidator.result,
  AuthController.refreshToken
);

module.exports = router;
