import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import checkAuthorize from '../_helpers/checkAuthorize.js'

dotenv.config();
const router = express.Router();

router.get('/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: process.env.FRONT_APP_URL + '/auth/success',
        failureRedirect: process.env.FRONT_APP_URL + '/auth/failure'
    })
)

router.get('/login', (req, res) => {
    //This will be deprecated since the connection will be from frontend
    res.send('<a href="/api/auth/google">Click to OAuth login with Google</a>')
})

//Require Login
router.get('/logout', checkAuthorize(), (req, res) => {
    req.logout();
    res.redirect(process.env.FRONT_APP_URL + '/auth/logout/success')
})

export default router;