const HttpError = require('../models/http-error');

const users = [
    {
        id:'1',
        athlete:'user1',
        email:'test@test.com',
        password:'pass1'
    },
    {
        id:'2',
        athlete:'user2',
        email:'test2@test.com',
        password:'pass2'
    }
]

const getUserbyID = (req, res, next)=>{
    const userID = req.params.uid;
    const user = users.find(u =>{
        return u.id === userID
    })
    if(!user){
        throw new HttpError ('User does not exist', 404);
    }
    res.json({user: user});
}

exports.getUserbyID = getUserbyID;