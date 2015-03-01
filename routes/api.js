var express = require('express');
var router = express.Router();
var models = require('../models.js');
var Dataset = models.Dataset;

function isAuthenticated(req, res, next) {
	if (! req.isAuthenticated()) {
		res.status(401);
    return res.json({"error": "please login"});
	}
	return next();
}

router.get('/datasets', function(req, res, next) {
	res.json([]);
});

router.post('/datasets', isAuthenticated, function(req, res, next) {
	res.json(req.body);
	/*
	var csvUrl = req.query.url;
	if (!csvUrl) {
		res.status(400);
		return res.json({"error":"missing csv url query parameter"});
	}
	res.status(201);
  res.json();
  */
});


module.exports = router;