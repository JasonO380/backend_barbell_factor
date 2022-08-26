const HttpError = require('../models/http-error');
const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');
// constructor in singular name "Workout" from workouts.js
const Workout = require('../models/workouts');

const dateEntry = new Date();

let session = [
    {
        id:"w1",
        month:"July",
        day:"1",
        movement:"Back Squat",
        rounds:"5",
        reps:"5",
        athlete:"user1",
        weight:"143kg"
    },
    {
        id:"w2",
        month:"July",
        day:"1",
        movement:"Power clean",
        rounds:"5",
        reps:"3",
        athlete:"user1",
        weight:"85kg"
    },
    {
        id:"w3",
        month:"July",
        day:"1",
        movement:"Press",
        rounds:"5",
        reps:"5",
        athlete:"user1",
        weight:"65kg"
    },
    {
        id:"w4",
        month:"July",
        day:"2",
        movement:"Power Snatch",
        rounds:"5",
        reps:"5",
        athlete:"user1",
        weight:"60kg"
    },
    {
        id:"w5",
        month:"July",
        day:"2",
        movement:"Snatch pull + floating snatch + snatch",
        rounds:"5",
        reps:"1 + 1 + 1",
        athlete:"user1",
        weight:"80kg"
    },
    {
        id:"w6",
        month:"July",
        day:"2",
        movement:"OHS",
        rounds:"5",
        reps:"5",
        athlete:"user1",
        weight:"80kg"
    },
    {
        id:"w7",
        month:"July",
        day:"3",
        movement:"Front Squat",
        rounds:"5",
        reps:"5",
        athlete:"user1",
        weight:"125kg"
    },
    {
        id:"w8",
        month:"July",
        day:"3",
        movement:"Muscle Snatch",
        rounds:"5",
        reps:"5",
        athlete:"user1",
        weight:"55kg"
    },
    {
        id:"w9",
        month:"August",
        day:"1",
        movement:"Clean pull + clean",
        rounds:"5",
        reps:"1 + 1",
        athlete:"user2",
        weight:"115kg"
    },
    {
        id:"w10",
        month:"August",
        day:"1",
        movement:"Push Jerk + Split Jerk",
        rounds:"6",
        reps:"1 + 3",
        athlete:"user2",
        weight:"100kg"
    },
    {
        id:"w11",
        month:"August",
        day:"2",
        movement:"Front Squat",
        rounds:"5",
        reps:"5",
        athlete:"user2",
        weight:"128kg"
    },
    {
        id:"w12",
        month:"August",
        day:"2",
        movement:"hip snatch + hang snatch",
        rounds:"5",
        reps:"1 + 2",
        athlete:"user2",
        weight:"85kg"
    },
]

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
        dayOfWeek: dateEntry.toLocaleString("default", { weekday: "long" }),
        month: dateEntry.toLocaleString("en-US", { month:"long" }),
        day:dateEntry.getDate(),
        year: dateEntry.getFullYear()
    })
    try {
        await sessionInfo.save();
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
        workoutToDelete = await Workout.findById(workoutID)
    } catch (err){
        const error = new HttpError('Something went wrong in the delete workout logic', 500);
        return next(error)
    }
    try {
        workoutToDelete.remove();
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
