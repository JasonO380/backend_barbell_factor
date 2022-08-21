const express = require('express');
const workoutControllers = require('../controllers/workouts-controller');

const router = express.Router();

router.get('/:wid', workoutControllers.getWorkoutsById);

router.get('/workoutlog/:uid', workoutControllers.getWorkoutsByUserID);

module.exports = router;