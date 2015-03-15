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
  title: String,
  creator: String,
  created: String,
  modified: String,
  publisher: Object,
  derivedFrom: String,
  distribution: Object,
  tableSchema: Object,
  version: Number,
});

var context = {
  csvw: "http://www.w3.org/ns/csvw#",
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  dc: "http://purl.org/dc/terms/",
  dcat: "http://www.w3.org/ns/dcat#",
  prov: "http://www.w3.org/ns/prov#",
  schema: "http://schema.org",
  title: "dc:title",
  creator: "dc:creator",
  publisher: "dc:publisher",
  created: "dc:created",
  modified: "dc:modified",
  name: "schema:name",
  url: "schema:url",
  tableSchema: "csvw:tableSchema",
  distribution: {
    "@id": "dcat:distribution"
  },
  downloadURL: {
    "@id": "dcat:downloadURL"
  },
  derivedFrom: {
    "@id": "prov:derivedFrom"
  }
};

DatasetSchema.statics.newFromUrl = function(url, next) {

  var frame = {
    "@context": context,
    "@type": "csvw:Table"
  };

  var datasetId = new mongoose.mongo.ObjectID();
  var csvFilename = path.join(config.data, datasetId + "-0.csv");

  request
    .get(url)
    .on('response', function() {
      // TODO: also look at response Link header and also for metadata.json
      var metadataUrl = url + "-metadata.json";
      request.get(metadataUrl, {json: true}, function (error, response, metadata) {
        jsonld.frame(metadata, frame, function(error, framed) {
          if (error) {
            console.error(error);
            return next(error, null)
          }
          var g = framed["@graph"][0];
          var dataset = new Dataset(g);
          dataset._id = datasetId;
          dataset.distribution = {
            derivedFrom: url,
            downloadURL: '/api/datasets/' + datasetId + '.csv'
          };
          dataset.derivedFrom = metadataUrl;
          dataset.version = 0;
          dataset.save(next);
        });
      });
    })
    .pipe(fs.createWriteStream(csvFilename));
}

DatasetSchema.methods.latestCsv = function() {
  return  path.join(config.data, this._id + '-' + this.version + '.csv');
}

DatasetSchema.methods.toJsonLd = function() {
  var d = this.toObject();
  d['@context'] = '/api/context';
  d['@id'] = '/api/datasets/' + d._id;
  d.url = '/datasets/' + d._id;
  delete d._id;
  delete d.__v;
  return(d);
}

var Dataset = mongoose.model('Dataset', DatasetSchema);

module.exports.User = User;
module.exports.Dataset = Dataset;
module.exports.context = context;
module.exports.mongoose = mongoose;
module.exports.config = config;