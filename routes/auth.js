var express = require('express');
var router = express.Router();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: 'HvvaAZDgPMAWgnYQ7CNOVlGxp',
    consumerSecret: 'GpQ2vyl8EztgRcqhCkD0rTMSX7aHCI48v5lD0n3oXMMEbP5AAc',
    callbackURL: 'http://localhost:3000/auth/twitter/callback',
    failureFlash: true,
    successFlash: 'Welcome!'
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));

module.exports = router;
module.passport = passport;
