const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Workout = require('../models/workouts');
//add User schema to link users to workouts
const User = require('../models/users');
const dateEntry = new Date();


const getWorkoutsById = async (req, res, next)=>{
    const workoutID = req.params.wid;
    let workout;
    try {
        workout = await Workout.findById(workoutID);
    } catch (err){
        const error = new HttpError('Something went wrong attempting to find that workout', 500);
        return next(error);
    };
    if(!workout){
        const error =  new HttpError('A workout with that ID does not exist', 404);
        return next(error);
    }
    res.json({workout: workout.toObject( {getters: true}) });
}

const getWorkoutsByUserName = async (req, res, next)=>{
    const userName = req.params.username;
    let userWorkoutInfo;
    try {
        userWorkoutInfo = await Workout.find({ athlete:userName });
    } catch (err){
        const error = new HttpError('Something went wrong with the user workout info logic', 500);
        return next(error);
    }
    res.json({workout: userWorkoutInfo.map(workouts => workouts.toObject({getters: true})) });
}

const addWorkouts = async (req, res, next) =>{
    const { movement, athlete, reps, rounds, weight, dayOfWeek, month, day, year } = req.body;
    //add validation from express-validator 
    const errors = validationResult(req);
    //check to see is errors is not empty if there are errors throw new HttpError
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Movement must be at least 3 characters and all fields must not be empty', 422)
    };
    const sessionInfo = new Workout ({
        movement,
        rounds,
        reps,
        weight,
        athlete,
        dayOfWeek,
        month,
        day,
        year
    })

    let user;
    try {
        user = await User.findById(athlete)
    } catch (err){
        const error = new HttpError('Adding workouts failed', 500);
        return next(error);
    }
    if(!user){
        const error = new HttpError('User not found', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await sessionInfo.save({ session: sess });
        user.workouts.push(sessionInfo);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong adding workout info', 500);
        return next (error)
    }
    res.status(201).json({session: sessionInfo})
}

const updateWorkout = async (req, res, next)=>{
    const { movement, reps, rounds, weight } = req.body;
    //add validation from express-validator 
    const errors = validationResult(req);
    //check to see is errors is not empty if there are errors throw new HttpError
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Movement must be at least 3 chearacters and all fields must not be empty', 422)
    };
    const workoutID = req.params.wid;
    let workoutToUpdate;
    try {
        workoutToUpdate= await Workout.findById(workoutID);
    } catch (err){
        const error = new HttpError('Something went wrong in the update workout logic', 500);
        return next(error);
    }
    workoutToUpdate.movement = movement;
    workoutToUpdate.rounds = rounds;
    workoutToUpdate.reps = reps;
    workoutToUpdate.weight = weight;
    try {
        await workoutToUpdate.save();
    } catch (err){
        const error = new HttpError('Updating workout failed', 422);
        return next(error)
    }
    res.status(200).json({workout: workoutToUpdate.toObject({getters: true}) });
}

const deleteWorkout = async (req, res, next)=>{
    const workoutID = req.params.wid;
    let workoutToDelete;
    try {
        workoutToDelete = await Workout.findById(workoutID).populate('athlete');
    } catch (err){
        const error = new HttpError('Something went wrong in the delete workout logic', 500);
        return next(error)
    }
    if(!workoutToDelete){
        const error = new HttpError('Could not find any workouts with that id', 422);
        return next(error);
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await workoutToDelete.remove({ session: sess });
        workoutToDelete.athlete.workouts.pull(workoutToDelete);
        await workoutToDelete.athlete.save({ session: sess });
        await sess.commitTransaction();
    } catch (err){
        const error = new HttpError('Could not delete the workout', 500);
        return next(error);
    }
    
    res.status(200).json({message:'Successfully deleted the workout session'});
}

exports.getWorkoutsById = getWorkoutsById;
exports.getWorkoutsByUserName = getWorkoutsByUserName;
exports.addWorkouts = addWorkouts;
exports.updateWorkout = updateWorkout;
exports.deleteWorkout = deleteWorkout;
