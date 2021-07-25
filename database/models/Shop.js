const sequelize = require("../Db_connection");
const { DataTypes, Model, UUID } = require("sequelize");

class Shop extends Model {}

Shop.init(
  {
    idShop: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
    },
    name: {
      type: DataTypes.STRING(50),
    },
    address: {
      type: DataTypes.STRING(100),
    },
    phone: {
      type: DataTypes.STRING(11),
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "Shop",
    modelName: "Shop",
  }
);

module.exports = Shop;
