const sequelize = require("../Db_connection");
const { DataTypes, Model, UUID } = require("sequelize");

class RefreshToken extends Model {}

RefreshToken.init(
  {
    idRefreshToken: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    refreshToken: {
      type: DataTypes.STRING(1000),
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "RefreshToken",
    tableName: "RefreshToken",
  }
);

module.exports = RefreshToken;
