import express from 'express';
import passport from 'passport';

const router = express.Router();

function isLoggedIn (req, res, next){
    req.user ? next() :  res.sendStatus(401);
}

router.get('/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    })
)

router.get('/login', (req, res) => {
    res.send('<a href="/auth/google">Click to OAuth login with Google</a>')
})

router.get('/logout', (req, res) => {
    req.logout();
    res.send('Goodbye!')
})

router.get('/success', isLoggedIn , (req, res) => {
    console.log(req.user);
    res.send(`Welcome ${req.user.emails} <br> <a href="/auth/logout">Logout</a>`)
})

router.get('/failure', (req, res) =>{
    res.send('Fail to authen.')
})

export default router;