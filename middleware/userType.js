function checkadmin(req, res, next){
    console.log("res.", req.userData)
    if(req.userData.userType == "admin"){
        next()
    }
    else{
        return res.status(401).send({message:"Unathorized user"})
    }
}

module.exports = checkadmin