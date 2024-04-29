var jwt = require('jsonwebtoken');

exports.auth_c = async (req,res,next)=>{
    jwt.verify(req.headers.authorization,"token",next)
}