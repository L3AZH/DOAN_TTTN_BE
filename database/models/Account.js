const sequelize = require("../Db_connection");
const { DataTypes, Model } = require("sequelize");
const jwt = require("jsonwebtoken");

class Account extends Model {
  generateToken() {
    const payload = { id: this.idAccount, email: this.email, role: this.role };
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_TIME,
    });
  }
  generateRefreshToken() {
    const payload = { id: this.idAccount, email: this.email, role: this.role };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
  }
}

Account.init(
  {
    idAccount: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
    },
    email: {
      type: DataTypes.STRING(50),
    },
    password: {
      type: DataTypes.STRING(50),
    },
    role: {
      type: DataTypes.STRING(10),
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "Account",
    modelName: "Account",
  }
);

module.exports = Account;
