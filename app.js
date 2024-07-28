const express = require("express");
const db = require("./db");
const employeeRouter = require("./router/employeeRouter");
const adminRouter = require("./router/adminRouter");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/employee", employeeRouter);
app.use("/admin", adminRouter)

db()
  .then(() => {})
  .catch((err) => console.log("database error", err));

console.log("port", process.env.PORT);

app.listen(process.env.PORT, () => console.log("port running"));
