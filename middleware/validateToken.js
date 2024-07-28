const secretKey = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken")

function validateToken(req, res, next){
    const token = req.headers.authorization?.split(' ')[1]; //bearer token
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try{
        const data = jwt.verify(token, secretKey)
        req.userData = data;
        next()
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