var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('users');
});

router.get('/:username', function(req, res, next) {
  res.render('user', {});
});

module.exports = router;
