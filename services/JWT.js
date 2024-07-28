const secretKey = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken")

function createJWT(data){
    try{
        const token = jwt.sign(data, secretKey, { expiresIn: "1h" })
        return token
    }
    catch(err){
        console.log("createJWT err", err)
        return false
    }
}

function validateJWT(token){
    try{
        const data = jwt.verify(token, secretKey)
        console.log("da", data)
        return data
    }
    catch(err){
        console.log("validata err", err.message)
        return false
    }
}

module.exports = {createJWT, validateJWT}