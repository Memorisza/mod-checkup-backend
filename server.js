import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import postRouter from './routes/posts.js'
import subjectRouter from './routes/subjects.js'

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