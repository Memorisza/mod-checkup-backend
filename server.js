import express from 'express'
import session from 'express-session'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import passport from 'passport'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import morgan from 'morgan'

import reviewRouter from './routes/reviews.js'
import subjectRouter from './routes/subjects.js'
import userRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import commentRouter from './routes/comments.js'

import './controllers/passport.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({credentials: true, origin:['http://localhost', 'http://20.190.72.211']}));
app.use(express.json())
app.use(morgan('dev'))

//Mongo DB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB has successfully connected.')
})

//Passport JS
app.use(session({ secret: process.env.EX_SESSION_SCR,
                  name: 'mcu-said',
                  resave: true,
                  saveUninitialized: false, 
                  cookie: {
                      maxAge: 24*60*60*1000,
                    //   secure: true
                  }}))
app.use(passport.initialize())
app.use(passport.session())

//Routing
app.use('/api/reviews', reviewRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentRouter);

//Swagger Ui
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Listening to port
app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
})