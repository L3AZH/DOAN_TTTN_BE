const express = require("express");
const errorHandler = require("./middlewares/ErrorHandler");
require("dotenv").config();
const app = express();
const port = process.env.port || 3000;
const sequelize = require("./database/Db_connection");
const AuthoRoute = require("./routes/AuthRoute");
app.use(express.json());
sequelize.sync();
// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log("connection has been established successfully");
//   } catch (err) {
//     console.error("unable to connection to the database: ", err);
//   }
// }
app.use("/api/auth", AuthoRoute);
app.use(errorHandler);
// testConnection();
app.listen(port, () => console.log(`Server is running on port ${port}`));
