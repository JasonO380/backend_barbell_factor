const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const workoutSchema = new Schema ({
    movement: {type: String, require: true},
    reps: {type: String, require: true},
    rounds: {type: Number, require: true},
    weight: {type: Number, require: true},
    dayOfWeek: {type: String, require: true},
    month: {type: String, require: true},
    day: {type: Number, require: true},
    year: {type: Number, require: true},
    athlete: {type: String, require: true}
});

module.exports = mongoose.model('Workout', workoutSchema);