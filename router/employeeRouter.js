const express = require("express");
const {
  createEmployee,
  getPersonalInfo,
  getOfficialInfo,
  getEmployeeList,
  updatePersonalInfo,
  updateOfficialInfo,
  relieveEmployee,
  relievedEmployeeList,
  employeeeLogin,
} = require("../controller/employeeController");
const validateToken = require("../middleware/validateToken");
const checkadmin = require("../middleware/userType");

const employeeRouter = express.Router();

employeeRouter.post("/create", validateToken, checkadmin, createEmployee);
employeeRouter.get("/personalInfo/:id", validateToken, getPersonalInfo);
employeeRouter.get("/officialInfo/:id", validateToken, getOfficialInfo);
employeeRouter.get("/list", validateToken, getEmployeeList);
employeeRouter.put("/update/personal/:id", validateToken, updatePersonalInfo);
employeeRouter.put("/update/official/:id", validateToken, checkadmin, updateOfficialInfo);
employeeRouter.put("/relieve/:id", validateToken, checkadmin, relieveEmployee);
employeeRouter.get("/relieved/list", validateToken, checkadmin,  relievedEmployeeList);
employeeRouter.put("/login", employeeeLogin)

module.exports = employeeRouter;
