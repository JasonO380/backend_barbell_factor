const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/users');
const dateEntry = new Date();


const getUsers = async (req, res, next)=>{
    let users;
    try {
        users = await User.find({}, '-password')
    } catch (err){
        const error = new HttpError('Error in retrieving users', 500);
        return next (error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true })) });
}

const signup = async (req, res, next)=>{
    const { username, password, email } = req.body;
    const errors = validationResult(req);
    //check to see if errors is not empty if there are errors throw new HttpError
    if(!errors.isEmpty()){
        console.log(errors);
        const error = new HttpError('Password must be at least 6 characters, email must contain @, username must not be empty', 422)
        return next(error);
    };
    //make sure mutliple email addresses can not be used
    let emailExists;
    let userNameExists;
    try {
        emailExists = await User.findOne({email: email});
    } catch (err){
        const error = new HttpError('Error on email exists logic', 500);
        return next(error);
    }
    if (emailExists){
        const error = new HttpError('Email already in use', 422);
        return next (error);
    }
    try {
        userNameExists = await User.findOne({username: username});
    } catch (err){
        const error = new HttpError('Error on username exists logic', 500);
        return next(error);
    }
    if (userNameExists){
        const error = new HttpError('Username has been taken', 422);
        return next(error);
    }

    const createdUser = new User ({
        username,
        email,
        password,
        macros:[],
        workouts:[]
    });
    try {
        await createdUser.save()
    } catch (err){
        const error = new HttpError('Something went wrong creating the user', 500);
        return next(error);
    }
    res.status(201).json({ newUser: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next)=>{
    const { email, password } = req.body;
    let verifiedUser;
    try {
        verifiedUser = await User.findOne({ email:email });
        console.log(verifiedUser);
    } catch(err){
        const error = new HttpError('email not found', 500);
        return next (error);
    }

    if(!verifiedUser){
        const error = new HttpError('Email not found', 401);
        return next(error);
    }
    if(!verifiedUser || verifiedUser.password !== password){
        const error = new HttpError('Email and password do not match', 401);
        return next(error);
    }
    res.json({message:'Succesfully logged in!!', user: verifiedUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;