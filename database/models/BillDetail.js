const sequelize = require("../Db_connection");
const { DataTypes, Model, UUID } = require("sequelize");
const Bill = require("./Bill");
const Product = require("./Product");

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
    ProductIdProduct: {
      field: "Product_idProduct",
      type: DataTypes.UUID,
      references: {
        model: Product,
        key: "idProduct",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "BillDetail",
    modelName: "BillDetail",
  }
);

Bill.belongsToMany(Product, { through: "BillDetail" });
Product.belongsToMany(Bill, { through: "BillDetail" });

module.exports = BillDetail;
