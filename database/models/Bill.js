const sequelize = require("../Db_connection");
const { DataTypes, Model } = require("sequelize");
const Account = require("./Account");

class Bill extends Model {}

Bill.init(
  {
    idBill: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    date: {
      type: DataTypes.DATE,
    },
    AccountIdAccount: {
      field: "Account_idAccount",
      type: DataTypes.UUID,
      references: {
        model: Account,
        key: "idAccount",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "Bill",
    modelName: "Bill",
  }
);

Account.hasMany(Bill);
Bill.belongsTo(Account);

module.exports = Bill;
