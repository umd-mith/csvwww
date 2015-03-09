var fs = require('fs');
var path = require('path');
var async = require('async');
var jsonld = require('jsonld');
var request = require('request');
var mongoose = require('mongoose');

var config = require('./config.json');

var User = mongoose.model('User', {
  username: String,
  name: String,
  avatar: String
});

var DatasetSchema = new mongoose.Schema({
  url: String,
  metadataUrl: String,
  metadata: Object,
  compactedMetadata: Object,
  title: String,
  creator: String,
  modified: String,
  versions: [
    {
      "csvFilename": String,
      "csvwFilename": String
    }
  ]
});

DatasetSchema.statics.newFromUrl = function(url, next) {

  var dataset = new Dataset({
    url: url, 
    metadataUrl: url + "-metadata.json"
  });

  dataset.versions = [{
    csvFilename: path.join(config.data,  dataset._id + "-0.csv"),
    csvwFilename: path.join(config.data, dataset._id + "-0.csvw")
  }];

  var frame = {
    "@context": {
      csvw: "http://www.w3.org/ns/csvw#",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      dc: "http://purl.org/dc/terms/",
      dcat: "http://www.w3.org/ns/dcat#",
      prov: "http://www.w3.org/ns/prov#",
      schema: "http://schema.org"
    },
    "@type": "csvw:Table"
  };

  request
    .get(dataset.url)
    .on('response', function() {
      request.get(dataset.metadataUrl, {json: true}, function (error, response, metadata) {
        fs.writeFileSync(dataset.versions[0].csvwFilename, JSON.stringify(metadata, null, 2));
        jsonld.frame(metadata, frame, function(error, framed) {
          if (error) {
            console.error(error);
            return ext(error, null)
          }
          var g = framed["@graph"][0];
          dataset.metadata = g;
          dataset.title = g['dc:title'];
          dataset.creator = g['dc:creator'];
          dataset.modified = g['dc:modified'];
          dataset.save(next);
        });
      });
    })
    .pipe(fs.createWriteStream(dataset.versions[0].csvFilename));
}

var Dataset = mongoose.model('Dataset', DatasetSchema);

module.exports.User = User;
module.exports.Dataset = Dataset;
module.exports.mongoose = mongoose;
module.exports.config = config;