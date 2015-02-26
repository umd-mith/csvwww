var fs = require('fs');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var db = require('../db.js');
var config = JSON.parse(fs.readFileSync('config.json'));

passport.use(new TwitterStrategy({
    consumerKey: config.twitterConsumerKey,
    consumerSecret: config.twitterConsumerSecret,
    callbackURL: config.twitterCallbackUrl,
    failureFlash: true,
    successFlash: 'Welcome!'
  },
  function(token, tokenSecret, profile, done) {
    db.User.findOne({username: profile.username}, function(err, user) {
      if (err) {
        console.log(err);
      } 
      if (user) {
        done(null, user);
      } else {
        user = new db.User({
          username: profile.username,
          displayName: profile.displayName,
          avatar: profile.photos[0]
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
  console.log('serializing: ' + user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.User.findById(id, function(err, user) {
    console.log('deseriealized: ' + user.username);
    done(null, user);
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', 
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }
));

module.exports = router;
