const express = require('express');
const workoutControllers = require('../controllers/workouts-controller');
const { check } = require('express-validator');

const router = express.Router();

router.get('/:wid', workoutControllers.getWorkoutsById);

router.get('/workoutlog/:uid', workoutControllers.getWorkoutsByUserID);

router.post('/',
[
    check('movement').isLength({min:3}),
    check('rounds').not().isEmpty(),
    check('reps').not().isEmpty(),
    check('weight').not().isEmpty()
], workoutControllers.addWorkouts);

router.patch('/:wid',
[
    check('movement').isLength({min:3}),
    check('rounds').not().isEmpty(),
    check('reps').not().isEmpty(),
    check('weight').not().isEmpty()
], workoutControllers.updateWorkout);

router.delete('/:wid', workoutControllers.deleteWorkout);

module.exports = router;