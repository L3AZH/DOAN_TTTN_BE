const { body, validationResult, param } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const Shop = require("../database/models/Shop");
const DetailShopProduct = require("../database/models/DetailShopProduct");
module.exports = {
  createNewShopValidation: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Pleaser enter shop name !!")
      .isLength({ max: 50 })
      .withMessage("Name Shop must be maximun 50 character !!")
      .custom(async (value) => {
        const findResult = await Shop.findOne({ where: { name: value } });
        if (findResult != null) {
          return Promise.reject(
            `Shop with ${value} name already exist in database`
          );
        }
      }),
    body("address")
      .trim()
      .notEmpty()
      .withMessage("Please enter address")
      .isLength({ max: 100 })
      .withMessage("Address Shop must be maximun 100 character !!"),
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Please enter shop phone number !!")
      .isNumeric()
      .withMessage("Phone number is invalid !!")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be 10 digit !!"),
  ],
  deleteShopValidation: [
    param("idShop")
      .trim()
      .notEmpty()
      .withMessage("Please enter idShop in path api !!")
      .custom(async (value) => {
        const findResult = await DetailShopProduct.findOne({
          where: { ShopIdShop: value },
        });
        if (findResult != null) {
          return Promise.reject(
            "Can't delete this shop beacause it exist in table Price List"
          );
        }
      })
      .custom(async (value) => {
        const findResult = await Shop.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: `Can't find any Shop with this ${value}`,
            })
          );
        }
      }),
  ],
  updateShopValidation: [
    param("idShop")
      .trim()
      .notEmpty()
      .withMessage("Please enter idShop in path api !!")
      .custom(async (value) => {
        const findResult = await Shop.findByPk(value);
        if (findResult == null) {
          return Promise.reject(
            new ErrorResponse(404, {
              message: `Can't find any Shop with this ${value}`,
            })
          );
        }
      }),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Pleaser enter shop name !!")
      .isLength({ max: 50 })
      .withMessage("Name Shop must be maximun 50 character !!")
      .custom(async (value) => {
        const findResult = await Shop.findOne({ where: { name: value } });
        if (findResult != null) {
          return Promise.reject(
            `Shop with ${value} name already exist in database`
          );
        }
      }),
    body("address")
      .trim()
      .notEmpty()
      .withMessage("Please enter address")
      .isLength({ max: 100 })
      .withMessage("Address Shop must be maximun 100 character !!"),
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Please enter shop phone number !!")
      .isNumeric()
      .withMessage("Phone number is invalid !!")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be 10 digit !!"),
  ],
  result: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (errors.array()[0].msg.code == null) {
        return res
          .status(400)
          .json(new ErrorResponse(400, { message: errors.array()[0].msg }));
      } else {
        return res
          .status(errors.array()[0].msg.code)
          .json(errors.array()[0].msg);
      }
    }
    next();
  },
};
