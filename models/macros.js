const mongoose = require('mongoose');
const dateEntry = new Date();

const Schema = mongoose.Schema;

const macroSchema = new Schema({
    carbs : {type: Number, require: true},
    protein: {type: Number, require: true},
    fats: {type: Number, require: true},
    dayOfWeek: {type: String, require: true},
    month: {type: String, require: true},
    day: {type: Number, require: true},
    year: {type: Number, require: true},
    athlete: {type: mongoose.Types.ObjectId, require: true, ref: 'User'}
})
//singular form of schema with upper case first letter
module.exports = mongoose.model('Macro', macroSchema);