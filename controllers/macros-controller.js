const HttpError = require('../models/http-error');
const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');
//constructor is singular name used in user.js schema set up
const Macro = require('../models/macros')

const dateEntry = new Date();

let macroData = [
    {
        id:"mac1",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"20",
        dayOfWeek:"Wednesday",
        carbs:"75",
        protein:"185",
        fats:"110"
    },
    {
        id:"mac2",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"21",
        dayOfWeek:"Thursday",
        carbs:"90",
        protein:"200",
        fats:"110"
    },
    {
        id:"mac3",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"22",
        dayOfWeek:"Friday",
        carbs:"80",
        protein:"185",
        fats:"105"
    },
    {
        id:"mac4",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"23",
        dayOfWeek:"Saturday",
        carbs:"160",
        protein:"195",
        fats:"50"
    },
    {
        id:"mac5",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"24",
        dayOfWeek:"Sunday",
        carbs:"140",
        protein:"190",
        fats:"40"
    },
    {
        id:"mac6",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"25",
        dayOfWeek:"Monday",
        carbs:"60",
        protein:"185",
        fats:"50"
    },
    {
        id:"mac7",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"26",
        dayOfWeek:"Tuesday",
        carbs:"90",
        protein:"190",
        fats:"40"
    },
    {
        id:"mac9",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"27",
        dayOfWeek:"Wednesday",
        carbs:"70",
        protein:"190",
        fats:"110"
    },
    {
        id:"mac10",
        athlete:"user1",
        year:"2022",
        month:"June",
        day:"28",
        dayOfWeek:"Wednesday",
        carbs:"70",
        protein:"190",
        fats:"110"
    },
    {
        id:"mac11",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"1",
        dayOfWeek:"Wednesday",
        carbs:"70",
        protein:"230",
        fats:"110"
    },
    {
        id:"mac12",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"2",
        dayOfWeek:"Thursday",
        carbs:"60",
        protein:"180",
        fats:"110"
    },
    {
        id:"mac13",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"3",
        dayOfWeek:"Friday",
        carbs:"110",
        protein:"205",
        fats:"90"
    },
    {
        id:"mac14",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"4",
        dayOfWeek:"Saturday",
        carbs:"220",
        protein:"230",
        fats:"50"
    },
    {
        id:"mac15",
        athlete:"user2",
        year:"2022",
        month:"July",
        day:"5",
        dayOfWeek:"Sunday",
        carbs:"130",
        protein:"190",
        fats:"45"
    },
]

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

    try {
        await macroInfo.save();
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
        throw new HttpError('Please enter a valid macro count. Fields must not be empty', 422)
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
        macrosToDelete = await Macro.findById(macroID);
    } catch (err){
        const error = new HttpError('Something went wrong with the delete macro logic', 500);
        return next(error);
    }
    try {
        macrosToDelete.remove();
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