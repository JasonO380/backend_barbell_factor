const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
//constructor is singular name used in user.js schema set up
const Macro = require('../models/macros')
//import User model in order to add to users macros
const User = require('../models/users');
const dateEntry = new Date();

const getMacrosById = async (req, res, next)=>{
    const macroID = req.params.mid;
    let macros;
    try {
        macros = await Macro.findById(macroID);
    } catch (err){
        const error = new HttpError('Something went wrong attempting to find macros by ID', 500);
        return next(error);
    };
    if(!macros){
        const error = new HttpError('No macros exist with that ID', 404);
        return next (error)
    }
    res.json({macros: macros.toObject( {getters: true}) });
};

const getMacrosByUserName = async (req, res, next)=>{
    const userName = req.params.username;
    let userMacroInfo;
    try {
        //match the Macro field key athlete with the parameter as the value to connect the schemas
        userMacroInfo = await Macro.find({athlete: userName})
    } catch (err){
        const error = new HttpError('Something went wrong with finding macros by username logic', 500);
        return next (error);
    }
    if(!userMacroInfo || userMacroInfo.length === 0){
        const error = new HttpError('Could not find any macro data for that athlete');
        return next(error);
    }
    res.json({macros: userMacroInfo.map(m => m.toObject({getters: true}) )});
};

const addMacros = async (req, res, next) => {
    //add validation from express-validator 
    const errors = validationResult(req);
    //check to see is errors is not empty if there are errors throw new HttpError
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Please enter a valid macro count. Fields must not be empty', 422)
    };
    const { carbs, protein, fats, athlete, dayOfWeek, month, day, year } = req.body;

    let foundUserMacroMonth;
    let foundUserMacroYear;
    let foundUserMacroDay;
    let userMacros;
    const currentDay = dateEntry.getDate();
    const currentMonth = dateEntry.toLocaleString("en-US", { month:"long" });
    const currentYear = dateEntry.getFullYear();
    try {
        userMacros = await User.findById(athlete).populate('macros');
        foundUserMacroYear = userMacros.macros.filter(u => u.year === year);
        foundUserMacroMonth = userMacros.macros.filter(u => u.month === month);
        foundUserMacroDay = userMacros.macros.filter(u => u.day === day);
        console.log(userMacros.macros);
    } catch (err){
        const error = new HttpError('Failed attempt to add macros', 500);
        return next(error);
    }
    if(foundUserMacroYear && foundUserMacroMonth && foundUserMacroDay){
        const error = new HttpError('Macros entered for day', 404);
        console.log('here check if macros for day entered');
        return next(error)
    }

    const macroInfo = new Macro({
        carbs,
        protein,
        fats,
        dayOfWeek: dateEntry.toLocaleString("default", { weekday: "long" }),
        month: dateEntry.toLocaleString("en-US", { month:"long" }),
        day:dateEntry.getDate(),
        year: dateEntry.getFullYear(),
        athlete,
    });

    let user;
    try {
        user = await User.findById(athlete);
    } catch (err){
        const error = new HttpError('Adding macros failed', 500);
        return next(error);
    }
    if(!user){
        const error = new HttpError('User not found', 404);
        return next(error);
    }

    try {
        //declare a variable to start the session
        const sess = await mongoose.startSession();
        //start the transaction
        sess.startTransaction();
        //save the transaction to an object
        await macroInfo.save({ session: sess });
        //make sure the macro data is added to the user
        user.macros.push(macroInfo);
        //save the user macro info as well
        await user.save({ session:sess });
        //end by committing the transaction
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError('Something went wrong adding macros', 500);
        return next(error);
    }
    
    res.status(201).json({macros: macroInfo})
}

const updateMacrosByID = async (req, res, next)=>{
    const { carbs, protein, fats } = req.body;
    //add validation from express-validator 
    const errors = validationResult(req);
    //check to see is errors is not empty if there are errors throw new HttpError
    if(!errors.isEmpty()){
        console.log(errors);
        const error = new HttpError('Please enter a valid macro count. Fields must not be empty', 422);
        return next(error);
    };
    const macroID = req.params.mid;
    let macrosToUpdate;
    try {
        macrosToUpdate = await Macro.findById(macroID)
    } catch (err){
        const error = new HttpError('Something went wrong in the update macros logic', 500);
        return next(error);
    }
    macrosToUpdate.protein = protein;
    macrosToUpdate.carbs = carbs;
    macrosToUpdate.fats = fats;
    try {
        await macrosToUpdate.save();
    } catch (err){
        const error = new HttpError('Updating macros failed', 422);
        return next(error);
    }
    res.status(200).json({macros:macrosToUpdate.toObject({getters: true}) });
};

const deleteMacrosbyID = async (req, res, next)=>{
    const macroID = req.params.mid;
    let macrosToDelete;
    try {
        macrosToDelete = await Macro.findById(macroID).populate('athlete');
    } catch (err){
        const error = new HttpError('Something went wrong with the delete macro logic', 500);
        return next(error);
    }
    if(!macrosToDelete){
        const error = new HttpError('Could not find macros to delete', 404);
        return next(error);
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await macrosToDelete.remove({ session: sess });
        macrosToDelete.athlete.macros.pull(macrosToDelete);
        await macrosToDelete.athlete.save({ session: sess });
        await sess.commitTransaction();
    } catch(err){
        const error = new HttpError('Could not delete macro data', 500);
        return next(error);
    }
    res.status(200).json({message:'Successfully deleted macros'})
}

exports.getMacrosById = getMacrosById;
exports.getMacrosByUserName = getMacrosByUserName;
exports.addMacros = addMacros;
exports.updateMacrosByID = updateMacrosByID;
exports.deleteMacrosbyID = deleteMacrosbyID;