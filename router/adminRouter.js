const express = require("express");
const { createAdmin, adminLogin } = require("../controller/adminController");

const adminRouter = express.Router()

adminRouter.post("/create", createAdmin)
adminRouter.put("/login", adminLogin)

module.exports = adminRouter;