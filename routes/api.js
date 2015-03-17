var express = require('express');
var router = express.Router();
var models = require('../models');
var Dataset = models.Dataset;

function isAuthenticated(req, res, next) {
  if (! req.isAuthenticated()) {
    res.status(401);
    return res.json({"error": "please login"});
  }
  return next();
}

router.get('/datasets', function(req, res, next) {
  Dataset.find()
    .sort('-created')
    .exec(function(err, datasets) {
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
    if (err) {
      res.status(400);
      return res.json({"error": err});
    }
    dataset.creator = req.user.username;
    dataset.save();
    res.status(201);
    res.set('Location', '/dataset/' + dataset._id);
    res.json(dataset);
  });
});

router.get('/datasets/:id', function(req, res, next) {
	Dataset.findById(req.params.id, function(err, dataset) {
		if (dataset) {
      res.json(dataset.toJsonLd());
		} else {
			res.send(404);
		}
	});
});

router.get('/datasets/:id.csv', function(req, res, next) {
	Dataset.findById(req.params.id, function(err, dataset) {
		if (dataset) {
      res.sendfile(data.latestCsv());
		} else {
			res.send(404);
		}
	});
});

router.get('/context', function(req, res, next) {
  res.json(models.context);
});

module.exports = router;