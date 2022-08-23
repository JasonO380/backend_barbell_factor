const HttpError = require('../models/http-error');
const { uuid } = require('uuidv4');

const macroDateEntry = new Date();

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

const addUser = (req, res, next)=>{
    const { username, password, email } = req.body;
    const userInfo = {
        username,
        email,
        password,
        id: uuid(),
        dayOfWeek: macroDateEntry.toLocaleString("default", { weekday: "long" }),
        month: macroDateEntry.toLocaleString("en-US", { month:"long" }),
        day:macroDateEntry.getDate(),
        year: macroDateEntry.getFullYear()
    };
    users.push(userInfo);
    res.status(201).json({newUser: userInfo})
}

exports.getUserbyID = getUserbyID;
exports.addUser = addUser;