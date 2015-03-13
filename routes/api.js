var express = require('express');
var router = express.Router();
var Dataset = require('../models').Dataset;

function isAuthenticated(req, res, next) {
  if (! req.isAuthenticated()) {
    res.status(401);
    return res.json({"error": "please login"});
  }
  return next();
}

router.get('/datasets', function(req, res, next) {
  Dataset.find(function(err, datasets) {
    res.json(datasets);
  });
});

router.post('/datasets', isAuthenticated, function(req, res, next) {
  var csvUrl = req.body.url;
  if (!csvUrl) {
    res.status(400);
    return res.json({"error":"missing csv url query parameter"});
  }
  Dataset.newFromUrl(csvUrl, function(err, dataset) {
    dataset.user = req.user.username;
    dataset.save();
    res.status(201);
    res.set('Location', '/dataset/' + dataset._id);
    res.json(dataset);
  });
});

router.get('/datasets/:id', function(req, res, next) {
	Dataset.findById(req.params.id, function(err, dataset) {
		if (dataset) {
      res.json(dataset);
		} else {
			res.send(404);
		}
	});
});

router.get('/datasets/:id.csv', function(req, res, next) {
	Dataset.findById(req.params.id, function(err, dataset) {
		if (dataset) {
      var v = dataset.versions[dataset.versions.length - 1];
      res.sendfile(v.csvFilename);
		} else {
			res.send(404);
		}
	});
});

module.exports = router;
