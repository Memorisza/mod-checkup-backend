import express from 'express'
import session from 'express-session'
import cors from 'cors'
import mongoose from 'mongoose'
import passport from 'passport'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import morgan from 'morgan'
import MemoryStore from 'memorystore';
import fileUpload from 'express-fileupload'
import helmet from 'helmet'

import config from './_helpers/config.js'
import reviewRouter from './routes/reviews.js'
import subjectRouter from './routes/subjects.js'
import userRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import commentRouter from './routes/comments.js'

import './controllers/passport.js'

const app = express();
const memStore = MemoryStore(session);
app.use(cors({credentials: true, origin: config.FRONT_APP_URL}));
app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}))

//Mongo DB
const uri = config.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB has successfully connected.')
})

//Passport JS
app.use(session({ secret: config.EX_SESSION_SCR,
                  name: 'mcu-said',
                  resave: true,
                  saveUninitialized: false, 
                  store: new memStore({
                    checkPeriod: 86400000 // prune expired entries every 24h
                  }),
                  cookie: {
                      maxAge: 24*60*60*1000,
                      httpOnly: true,
                      secure: true,
                      domain: 'mod-checkup.site'
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
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Calling other paths (Wrong Path)
app.all('*', (req, res) => {
  res.sendStatus(404);
})

//Listening to port
app.listen(config.PORT, () =>{
    console.log(`NODE_ENV=${config.NODE_ENV}`);
    console.log(`Server is running on port: ${config.PORT}`);
})