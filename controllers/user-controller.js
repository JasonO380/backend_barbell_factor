const HttpError = require('../models/http-error');
const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');

const dateEntry = new Date();

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

const getUsers = (req, res, next)=>{
    res.json({users: users});
}

const signup = (req, res, next)=>{
    const { username, password, email } = req.body;
    const errors = validationResult(req);
    //check to see is errors is not empty if there are errors throw new HttpError
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Password must be at least 6 characters, email must contain @, username must not be empty', 422)
    };
    //make sure mutliple email addresses can not be used
    const emailExists = users.find(u => u.email === email);
    if (emailExists){
        throw new HttpError('Email address already in use', 422);
    }
    const createdUser = {
        username,
        email,
        password,
        id: uuid(),
        dayOfWeek: dateEntry.toLocaleString("default", { weekday: "long" }),
        month: dateEntry.toLocaleString("en-US", { month:"long" }),
        day:dateEntry.getDate(),
        year: dateEntry.getFullYear()
    };
    users.push(createdUser);
    res.status(201).json({newUser: createdUser})
};

const login = (req, res, next)=>{
    const { email, password } = req.body;
    //check to see is errors is not empty if there are errors throw new HttpError
    const verifiedUser = users.find(users => users.email === email);
    //check to see if there is not a verified user and or if password entered is not equal to password stored
    if(!verifiedUser || verifiedUser.password !== password){
        throw new HttpError('Incorrect email and or password', 401)
    }
    res.json({message:'Successfully logged in'})
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;