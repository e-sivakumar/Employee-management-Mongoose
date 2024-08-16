const Admin = require("../model/adminModel");
const { createHash, validatePassword } = require("../services/bcrypt");
const {v4: uuidv4} = require("uuid");
const { createJWT } = require("../services/JWT");
const {info, error} = require("../config/logger");

async function createAdmin(req,res){
    try{
        const {name, userName, password} = req.body;
        info.info(`createAdmin initiated - name:${name}, userName:${userName}, password:${password}`);
        const hashedPassword = await createHash(password)
        await Admin.create({
            _id: uuidv4(),
            userName,
            name,
            password: hashedPassword
        })
        info.info(`createAdmin name:${name} admin created`)
        return res.status(200).send({message: "Admin created successfully"})
    }
    catch(err){
        console.log("createAdmin err", err)
        error.error(`createAdmin error: ${JSON.stringify(err)}`)
      res.status(500).send({message:"Internal server error"})
    }
  }
  
  async function adminLogin(req,res){
    try{
        const {userName, password} = req.body;
        if(!userName || !password){
            return res.status(400).send({message:"Invalid arguments"})
        }
        const adminData = await Admin.findOne({userName});
        if(!adminData){
            return res.status(400).send({message: "Invalid username"})
        }
        const verifyPassword = await validatePassword(password, adminData.password)
        if(verifyPassword){
            const userData = {name: adminData.name, userType: "admin", id: adminData._id}
            const generatedToken = createJWT(userData)
            return res.status(200).send({message:"User logged in successfully", userData, token: generatedToken})
        }
        else{
            return res.status(400).send({message: "Invalid password"})
        } 
    }
    catch(err){
        console.log("adminLogin err", err)
        error.error(`adminLogin error: ${JSON.stringify(err)}`)
      res.status(500).send({message:"Internal server error"})
    }
  }

  module.exports = {createAdmin, adminLogin}