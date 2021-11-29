import express from 'express';
import passport from 'passport';
import checkAuthorize from '../_helpers/checkAuthorize.js'
import config from '../_helpers/config.js'

const router = express.Router();

router.get('/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: config.FRONT_APP_URL ,
        failureRedirect: config.FRONT_APP_URL + '/auth/failure'
    })
)

//Require Login
router.get('/logout', checkAuthorize(), (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        res.clearCookie('mcu-said');
        // Don't redirect, just print text
        res.status(200).json({ message:'Logged out' });
    });
})

export default router;