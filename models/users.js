const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    //workouts and macros return an array of objects ref prop directs to the schema
    workouts: [{type: mongoose.Types.ObjectId, require: true, ref: 'Workout'}],
    macros: [{type: mongoose.Types.ObjectId, require: true, ref: 'Macro'}]
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);