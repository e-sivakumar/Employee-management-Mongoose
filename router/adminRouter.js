const express = require("express");
const { createAdmin, adminLogin } = require("../controller/adminController");

function verifyAdmin(req, res, next){
    const {userName, password} = req.body.adminCredentials;
    const adminUserName = process.env.ADMIN_USER_NAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if(adminUserName === userName && adminPassword === password){
        next()
    }
    else{
        res.status(400).send({Message: "Unauthorized user"})
    }
}

const adminRouter = express.Router()

adminRouter.post("/create", verifyAdmin, createAdmin)
adminRouter.put("/login", adminLogin)

module.exports = adminRouter;