const express = require("express");
const errorHandler = require("./middlewares/ErrorHandler");
require("dotenv").config();
const app = express();
const port = process.env.port || 3000;
const sequelize = require("./database/Db_connection");
const AuthRoute = require("./routes/AuthRoute");
const CategoryRoute = require("./routes/CategoryRoute");
const ProductRoute = require("./routes/ProductRoute");
const ShopRoute = require("./routes/ShopRoute");
const PriceListRoute = require("./routes/PriceListRoute");
sequelize.sync();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log("connection has been established successfully");
//   } catch (err) {
//     console.error("unable to connection to the database: ", err);
//   }
// }
app.use("/api/auth/", AuthRoute);
app.use("/api/category/", CategoryRoute);
app.use("/api/product/", ProductRoute);
app.use("/api/shop/", ShopRoute);
app.use("/api/pricelist/", PriceListRoute);
app.use(errorHandler);
// testConnection();
app.listen(port, () => console.log(`Server is running on port ${port}`));
