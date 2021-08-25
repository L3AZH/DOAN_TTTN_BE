const sequelize = require("../Db_connection");
const { DataTypes, Model, UUID } = require("sequelize");
const Shop = require("./Shop");
const Product = require("./Product");

class DetailShopProduct extends Model {}

DetailShopProduct.init(
  {
    ShopIdShop: {
      field: "Shop_idShop",
      type: DataTypes.UUID,
      references: {
        model: Shop,
        key: "idShop",
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
    price: {
      type: DataTypes.DOUBLE,
    },
    image: {
      type: DataTypes.BLOB,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "DetailShopProduct",
    modelName: "DetailShopProduct",
  }
);

Product.belongsToMany(Shop, { through: "DetailShopProduct" });
Shop.belongsToMany(Product, { through: "DetailShopProduct" });

module.exports = DetailShopProduct;
