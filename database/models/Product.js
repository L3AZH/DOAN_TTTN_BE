const sequelize = require("../Db_connection");
const { DataTypes, Model, UUID } = require("sequelize");
const Category = require("./Category");

class Product extends Model {}

Product.init(
  {
    idProduct: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    name: {
      type: DataTypes.STRING(50),
    },
    price: {
      type: DataTypes.DOUBLE,
    },
    image: {
      type: DataTypes.BLOB,
    },
    CategoryIdCategory: {
      field: "Category_idCategory",
      type: DataTypes.UUID,
      references: {
        model: Category,
        key: "idCategory",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "Product",
    modelName: "Product",
  }
);

Category.hasMany(Product);
Product.belongsTo(Category);

module.exports = Product;
