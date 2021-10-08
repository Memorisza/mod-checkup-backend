import passport from 'passport'
import { OAuth2Strategy } from 'passport-google-oauth';
import userModel from '../models/user.js'
import config from '../_helpers/config.js'

//Passport JS
passport.use(new OAuth2Strategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.BACK_APP_URL + '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        // Get the user data from google
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value
        }
        try{
            //Find the logged in user in DB
            let user = await userModel.findOne({googleId: profile.id})
            if(user){
                //If present
                done(null, user)
            } else {
                //If not, create one
                user = await userModel.create(newUser)
                done(null, user)
            }
        }catch(err){
            console.err(err)
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    userModel.findById(id, (err, user) => done(err, user))
});