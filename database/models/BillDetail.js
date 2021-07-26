const sequelize = require("../Db_connection");
const { DataTypes, Model, UUID } = require("sequelize");
const Bill = require("./Bill");
const PriceList = require("./PriceList");

class BillDetail extends Model {}

BillDetail.init(
  {
    BillIdBill: {
      field: "Bill_idBill",
      type: DataTypes.UUID,
      references: {
        model: Bill,
        key: "idBill",
      },
    },
    PriceListProductIdProduct: {
      field: "PriceList_Product_idProduct",
      type: DataTypes.UUID,
      references: {
        model: PriceList,
        key: "Product_idProduct",
      },
    },
    PriceListShopIdShop: {
      field: "PriceList_Shop_idShop",
      type: DataTypes.UUID,
      references: {
        model: PriceList,
        key: "Shop_idShop",
      },
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "BillDetail",
    modelName: "BillDetail",
  }
);

Bill.belongsToMany(PriceList, { through: "BillDetail" });
PriceList.belongsToMany(Bill, { through: "BillDetail" });

module.exports = BillDetail;
