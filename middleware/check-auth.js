const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

let tokenSecret = process.env.TOKEN;

module.exports = (req, res, next) => {
    if(req.method === "OPTIONS"){
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token){
            const error = new HttpError('Web token authorization failed', 401);
            return next(error);
        }
        const decodedToken = jwt.verify(token, tokenSecret);
        req.userData = {userID: decodedToken.userID};
        next();
        } catch (err){
            const error = new HttpError('Web token failed', 401);
            return next(error);
    }
};