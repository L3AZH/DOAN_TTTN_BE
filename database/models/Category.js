const sequelize = require("../Db_connection");
const { DataTypes, Model, UUID } = require("sequelize");

class Category extends Model {}

Category.init(
  {
    idCategory: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    name: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "Category",
    modelName: "Category",
  }
);

module.exports = Category;
