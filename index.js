const express = require('express');
const bodyparser = require('body-parser');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');
require('dotenv').config();

const workoutRoutes = require('./routes/workout-routes');
const macroRoutes = require('./routes/macros-routes');
const userRoutes = require('./routes/user-routes');

const app = express();
let URL = process.env.URL

app.use(bodyparser.json());

app.use('/api/workouts',workoutRoutes);

app.use('/api/macros',macroRoutes);

app.use('/api/users',userRoutes);

app.use((req, res, next)=> {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

app.use((error, req, res, next)=> {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred'})
})

mongoose
    .connect(URL)
    .then(()=> {
        app.listen(5000);
    })
    .catch(err =>{
        console.log(err);
    })

