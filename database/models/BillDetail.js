const sequelize = require("../Db_connection");
const { DataTypes, Model, UUID } = require("sequelize");
const Bill = require("./Bill");
const DetailShopProduct = require("./DetailShopProduct");

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
    DetailShopProductProductIdProduct: {
      field: "DetailShopProduct_Product_idProduct",
      type: DataTypes.UUID,
      references: {
        model: DetailShopProduct,
        key: "Product_idProduct",
      },
    },
    DetailShopProductShopIdShop: {
      field: "DetailShopProduct_Shop_idShop",
      type: DataTypes.UUID,
      references: {
        model: DetailShopProduct,
        key: "Shop_idShop",
      },
    },
    amount: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "BillDetail",
    modelName: "BillDetail",
  }
);

Bill.belongsToMany(DetailShopProduct, { through: "BillDetail" });
DetailShopProduct.belongsToMany(Bill, { through: "BillDetail" });

module.exports = BillDetail;
