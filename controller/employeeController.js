const Employee = require("../model/employeeModel");
const { v4: uuidv4 } = require("uuid");
const { validatePassword, createHash } = require("../services/bcrypt");
const { createJWT } = require("../services/JWT");
const {info, error} = require("../config/logger");
const { sendMailToEmployee, sendMailToEmployer } = require("../services/mail");

async function createEmployee(req, res) {
  try {
    info.info(`createEmployee initiated`);
    const {
      name,
      email,
      phoneNumber,
      position,
      salary,
      experience = 0,
    } = req.body;
    info.info(`createEmployee req.body:${JSON.stringify(req.body)}`);
    if (!name || !email || !phoneNumber || !position || !salary) {
      error.error(`createEmployee error: Invalid arguments`)
      return res.status(400).send({ message: "Invalid arguments" });
    }
    let employeeData = await Employee.find({ email });
    if (employeeData && employeeData.length > 0) {
      error.error(`createEmployee error: Email already exists`)
      return res
        .status(400)
        .send({ message: "Email already exist with other user" });
    }
    employeeData = await Employee.find({ phoneNumber });
    if (employeeData && employeeData.length > 0) {
      error.error(`createEmployee error: Phone number already exists`)
      return res
        .status(400)
        .send({ message: "Phone number already exist with other user" });
    }

    const password = Math.floor(Math.random() * 899999) + 100000;
    const hashedPassword = await createHash(password.toString());

    const id = uuidv4();
    
    const userDetails = {
      _id: id,
      name,
      email,
      phoneNumber,
      position,
      salary,
      experience,
      password ,
    }

    await Employee.create({
      ...userDetails,
      password: hashedPassword
    });
    info.info(`createEmployee id:${id} employee created successfully`)

    await sendMailToEmployee(email, password)
    .then(()=>info.info(`createEmployee employee mail sent sucessfully: mail:${email}, password:${password}`))
    .catch((err)=>error.error(`createEmployee employee mail not sent, mail:${email}, psasword:${password}, error:${JSON.stringify(err)}`))

    await sendMailToEmployer(userDetails)
    .then(()=>info.info(`createEmployee employer mail sent sucessfully`))
    .catch((err)=>error.error(`createEmployee employer mail not sent, error:${JSON.stringify(err)}`))

    res.status(200).send({ message: "Employee created successfully" });
  } catch (err) {
    console.log("error", err);
    error.error(`createEmployee error:${JSON.stringify(err)}`)
    res.status(500).send({ message: "Couldn't create employee" });
  }
}

async function getPersonalInfo(req, res) {
  try {
    const id = req.params.id;
    const employeeData = await Employee.findOne(
      { _id: id },
      { name: 1, phoneNumber: 1, email: 1 }
    );
    res.status(200).send({ message: "Data fetched", data: employeeData });
  } catch (err) {
    console.log("getPersonalInfo err", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function getOfficialInfo(req, res) {
  try {
    const id = req.params.id;
    const employeeData = await Employee.findOne(
      { _id: id, isCurrentlyEmployed: true },
      { name: 1, position: 1, experience: 1, employedSince: 1, salary: 1 }
    );
    res.status(200).send({ message: "Data fetched", data: employeeData });
  } catch (err) {
    console.log("getOfficalInfo err", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function getEmployeeList(req, res) {
  try {
    const employeeData = await Employee.find(
      { isCurrentlyEmployed: true },
      { name: 1, position: 1 }
    );
    res.status(200).send({ message: "Data fetched", data: employeeData });
  } catch (err) {
    console.log("getEmployeeList err", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function updatePersonalInfo(req, res) {
  try {
    const { name, phoneNumber, email } = req.body;
    const id = req.params.id;

    let employeeData = await Employee.find({ _id: { $ne: id }, email });
    if (employeeData && employeeData.length > 0) {
      return res
        .status(400)
        .send({ message: "Email already exist with other user" });
    }

    employeeData = await Employee.find({ _id: { $ne: id }, phoneNumber });
    if (employeeData && employeeData.length > 0) {
      return res
        .status(400)
        .send({ message: "Phone number already exist with other user" });
    }

    await Employee.updateOne(
      { _id: id },
      {
        $set: {
          name,
          email,
          phoneNumber,
        },
      }
    );
    res.status(200).send({ message: "Employee updated successfully" });
  } catch (err) {
    console.log("updatePersonalInfo err", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function updateOfficialInfo(req, res) {
  try {
    const { position, salary } = req.body;
    const id = req.params.id;

    await Employee.updateOne(
      { _id: id },
      {
        $set: {
          position,
          salary,
        },
      }
    );
    res.status(200).send({ message: "Employee updated successfully" });
  } catch (err) {
    console.log("updatePersonalInfo err", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function relieveEmployee(req, res){
  try{
    const {id} = req.params;
    await Employee.updateOne({_id:id},{
      $set:{
        isCurrentlyEmployed: false,
        lastDate: Date.now()
      }
    });
    res.status(200).send({message:"Employee updated successfully"})
  }
  catch(err){
    console.log("relieveEmployee err", err)
    res.status(500).send({message: "Internal server error"})
  }
}

async function relievedEmployeeList(req, res){
  try{
    const employeeData = await Employee.find({isCurrentlyEmployed: false})
    res.status(200).send({message: "Data fetched", data: employeeData})
  }
  catch(err){
    console.log("relived list err", err)
    res.status(500).send({message:"Internal server error"})
  }
}

async function employeeeLogin(req, res){
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).send({message:"Invalid arguments"})
    }
    const employeeData = await Employee.findOne({email});
    if(!employeeData){
      return res.status(400).send({message: "Invalid email"})
    }
    const verifyPassword = await validatePassword(password, employeeData.password)
    if(verifyPassword){
      const userData = {name: employeeData.name, userType: "employee", id: employeeData._id}
      const generatedToken = createJWT({name: employeeData.name, userType: "employee", id: employeeData._id})
      return res.status(200).send({message:"User logged in successfully", userData, token: generatedToken})
    }
    else{
      return res.status(400).send({message: "Invalid password"})
    }
  }
  catch(err){
    console.log("employeeLogin err", err )
    res.status(500).send({message:"Internal server error"})
  }
}

module.exports = {
  createEmployee,
  getPersonalInfo,
  getOfficialInfo,
  getEmployeeList,
  updatePersonalInfo,
  updateOfficialInfo,
  relieveEmployee,
  relievedEmployeeList,
  employeeeLogin
};
