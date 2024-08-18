const jwt = require('jsonwebtoken')

const createToken = (user)=>{
    return jwt.sign({user},process.env.JWT);
}

const auth = (req,res,next)=>{
    next();

}

module.exports = {createToken,auth}