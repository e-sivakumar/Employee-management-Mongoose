const mongoose = require("mongoose")
require("dotenv").config();

mongoose.Promise = global.Promise;
const url = process.env.URL;

async function db(){
    try{
        console.log("db", url)
        await mongoose.connect(url);
        console.log("db connected");
    }
    catch(err){
        console.log(" db err", err);
    }
}

module.exports = db;