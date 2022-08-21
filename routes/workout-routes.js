const express = require('express');

const router = express.Router();

const session = [
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

router.get('/:wid', (req, res, next)=>{
    const workoutID = req.params.wid;
    const workout = session.find(w =>{
        return w.id === workoutID
    })
    if (!workout){
        return res.status(404).json({error:'No workouts found'})
    }
    res.json({workout: workout});
});

router.get('/workoutlog/:uid', (req, res, next)=>{
    const userID = req.params.uid;
    let workoutHistory = [];
    const workouts = session.map(w =>{
        if(w.athlete === userID){
            workoutHistory.push(w)
        }
    })
    if(workoutHistory.length === 0){
        return res.status(404).json({error:'No workouts found for that user or user does not exist'})
    }
    res.json({workoutHistory});
});

module.exports = router;