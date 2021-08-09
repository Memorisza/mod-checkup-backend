var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var dotenv = require('dotenv');

var postRouter = require('./routes/posts.js');
var subjectRouter = require('./routes/subjects.js');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB has successfully connected.')
})

//Routing
//Example
// const exercisesRouter = require('./routes/exercises');
// const usersRouter = require('./routes/users');

// app.use('/exercises', exercisesRouter);
// app.use('/users', usersRouter);
app.use('/reviews', postRouter);
app.use('/subjects', subjectRouter);

app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
})