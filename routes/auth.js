var fs = require('fs');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models.js').User;
var config = JSON.parse(fs.readFileSync('config.json'));

passport.use(new TwitterStrategy({
    consumerKey: config.twitterConsumerKey,
    consumerSecret: config.twitterConsumerSecret,
    callbackURL: config.twitterCallbackUrl,
    failureFlash: true,
    successFlash: 'Welcome!'
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({username: profile.username}, function(err, user) {
      if (err) {
        console.log(err);
      }
      if (user) {
        done(null, user);
      } else {
        console.log(profile);
        user = new User({
          username: profile.username,
          displayName: profile.displayName,
          avatar: profile.photos[0].value
        });
        user.save(function(err, user) {
          if (err) {
            console.log(err);
          } else {
            done(null, user);
          }
        });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(null, user);
  });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/login', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }
));

module.exports = router;
