const secretKey = process.env.JWT_SECRET;
const httpContext = require("express-http-context");
const {v4: uuidv4} = require("uuid");
const jwt = require("jsonwebtoken")

function validateToken(req, res, next){
    const token = req.headers.authorization?.split(' ')[1]; //bearer token
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try{
        const data = jwt.verify(token, secretKey)
        req.userData = data;
        if(req.userData){
            httpContext.set('x_txn_id', uuidv4())
            httpContext.set('x_user_id', data.id)
            httpContext.set('x_api_name', req.originalUrl)
            next()
        }
        else{
            res.status(401).send({message:"Unauthorized user"})
        }
    }
    catch(err){
        console.log("validata err", err.message)
        if(err.message == "jwt expired"){
            return res.status(400).send({message: "Token expired"})
        }
        return res.status(400).send({message: "Invaild token"})
    }
}

module.exports = validateToken