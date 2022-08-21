const express = require('express');
const bodyparser = require('body-parser');

const workoutRoutes = require('./routes/workout-routes');
const macroRoutes = require('./routes/macros-routes');
const userRoutes = require('./routes/user-routes');

const app = express();

app.use('/api/workouts',workoutRoutes);
app.use('/api/macros',macroRoutes);
app.use('/api/users',userRoutes);

app.listen(5000);