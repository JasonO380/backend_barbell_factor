const HttpError = require('../models/http-error');
const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');

const macroDateEntry = new Date();

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

const getWorkoutsById = (req, res, next)=>{
    const workoutID = req.params.wid;
    const workout = session.find(w =>{
        return w.id === workoutID
    })
    if (!workout){
        throw new HttpError ('No workout data found', 404);
    }
    res.json({workout: workout});
}

const getWorkoutsByUserID = (req, res, next)=>{
    const userID = req.params.uid;
    const workouts = session.filter(w => w.athlete === userID);    
    if(workouts.length === 0){
        throw new HttpError('The user ID does not exist or there is no workout data entered', 404);
    }
    res.json({workouts});
}

const addWorkouts = (req, res, next) =>{
    const { movement, athlete, reps, rounds, weight, id, dayOfWeek, month, day, year } = req.body;
    //add validation from express-validator 
    const errors = validationResult(req);
    //check to see is errors is not empty if there are errors throw new HttpError
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Movement must be at least 3 characters and all fields must not be empty', 422)
    };
    const sessionInfo = {
        movement,
        athlete,
        reps,
        rounds,
        weight,
        id:uuid(),
        dayOfWeek: macroDateEntry.toLocaleString("default", { weekday: "long" }),
        month: macroDateEntry.toLocaleString("en-US", { month:"long" }),
        day:macroDateEntry.getDate(),
        year: macroDateEntry.getFullYear()
    };
    session.push(sessionInfo);
    res.status(201).json({session: sessionInfo})
}

const updateWorkout = (req, res, next)=>{
    const { movement, reps, rounds, weight } = req.body;
    //add validation from express-validator 
    const errors = validationResult(req);
    //check to see is errors is not empty if there are errors throw new HttpError
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Movement must be at least 3 chearacters and all fields must not be empty', 422)
    };
    const workoutID = req.params.wid;
    //spread operator to make a copy of the old values
    const updatedWorkout = {...session.find(w=> w.id === workoutID)};
    //find the index of the workout thats being updated
    const workoutIndex = session.findIndex(w=> w.id === workoutID);
    //update the fields with new values
    updatedWorkout.movement = movement;
    updatedWorkout.reps = reps;
    updatedWorkout.rounds = rounds;
    updatedWorkout.weight = weight;
    //put the updated workouts back into the original workout indexes place
    session[workoutIndex] = updatedWorkout;
    res.status(200).json({message: 'Successfully updated workout info'})
}

const deleteWorkout = (req, res, next)=>{
    const workoutID = req.params.wid;
    if(!session.find(w => w.id === workoutID)){
        throw new HttpError('Workout with that id does not exist', 404)
    }
    session = session.filter(w => w.id !== workoutID);
    res.status(200).json({message:'Successfully deleted the workout session'});
}

exports.getWorkoutsById = getWorkoutsById;
exports.getWorkoutsByUserID = getWorkoutsByUserID;
exports.addWorkouts = addWorkouts;
exports.updateWorkout = updateWorkout;
exports.deleteWorkout = deleteWorkout;
