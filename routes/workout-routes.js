const express = require('express');
const workoutControllers = require('../controllers/workouts-controller');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/:wid', workoutControllers.getWorkoutsById);

router.get('/workoutlog/:username', workoutControllers.getWorkoutsByUserName);

router.use(checkAuth);

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