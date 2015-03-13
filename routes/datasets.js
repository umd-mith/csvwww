var express = require('express');
var router = express.Router();
var Dataset = require('../models').Dataset;

router.get('/', function(req, res, next) {
  res.render('datasets', {});
});

router.get('/:id', function(req, res, next) {
  Dataset.findById(req.params.id, function(err, dataset) {
    if (dataset) {
      res.render('dataset', {dataset: dataset});
    } else {
      res.send(404);
    }
  });
});

module.exports = router;

