var fs = require('fs');
var daff = require('daff');
var path = require('path');
var async = require('async');
var jsonld = require('jsonld');
var request = require('request');
var mongoose = require('mongoose');
var babyparse = require('babyparse')

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
  created: Date,
  modified: Date,
  publisher: Object,
  derivedFrom: String,
  distribution: Object,
  tableSchema: Object,
  version: Number,
  notes: Array
});

var context = {

  // namespaces
  csvw: "http://www.w3.org/ns/csvw#",
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  dc: "http://purl.org/dc/terms/",
  dcat: "http://www.w3.org/ns/dcat#",
  prov: "http://www.w3.org/ns/prov#",
  schema: "http://schema.org",
  oa: "http://www.w3.org/ns/oa#",

  // terms
  title: "dc:title",
  creator: "dc:creator",
  publisher: "dc:publisher",
  created: "dc:created",
  modified: "dc:modified",
  name: "schema:name",
  url: "schema:url",
  tableSchema: "csvw:tableSchema",
  body: "oa:hasBody",
  source: "oa:hasSource",
  target: "oa:hasTarget",
  motivation: "oa:motivatedBy",
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

/*
 * Pass in a CSV URL and get back a dataset object for it.
 */

DatasetSchema.statics.newFromUrl = function(url, next) {

  var frame = {
    "@context": context,
    "@type": "csvw:Table"
  };

  var datasetId = new mongoose.mongo.ObjectID();
  var csvFilename = path.join(config.data, datasetId + "-0.csv");

  request
    .get(url)
    .on('response', function(response) {

      if (response.statusCode != 200) {
        return next("CSV does not exist at " + url, null);
      }

      // save the metadata 
      // TODO: also look at response Link header and also for metadata.json
      var metadataUrl = url + "-metadata.json";
      request.get(metadataUrl, {json: true}, function (error, response, metadata) {
        jsonld.frame(metadata, frame, function(error, framed) {
          if (response.statusCode != 200 || error) {
            var dataset = new Dataset();
            dataset.title = "Dataset " + datasetId;
          } else {
            var dataset = new Dataset(framed["@graph"][0]);
            dataset.derivedFrom = metadataUrl;
          }
          dataset._id = datasetId;
          dataset.distribution = {
            derivedFrom: url,
            downloadURL: '/api/datasets/' + datasetId + '.csv'
          };
          dataset.version = 0;
          dataset.created = new Date();
          dataset.modified = new Date();
          dataset.save(next);
        });
      });

      // save the csv
      response.pipe(fs.createWriteStream(csvFilename));
    })
}

DatasetSchema.methods.addCsv = function(filename, comment, next) {
  var nextVersion = this.version == null ? 0 : this.version + 1;
  var that = this;

  var inFile = fs.createReadStream(filename);
  inFile.on('error', function() {
    next(err, null);
  });

  var outFile = fs.createWriteStream(this.csv(nextVersion));
  outFile.on('error', function() {
    next(err, null);
  });

  outFile.on('close', function() {
    that.version = nextVersion;

    if (that.version != 0) {
      that.notes.push({
        'created': 'foo',
        'creator': 'foo',
        'motivation': 'oa:editing',
        'body': {
          'text': comment
        },
        'target': that.targets(that.version, that.version - 1)
      });
    }

    that.save(function(err, dataset) {
      if (err) {
        next(err, null);
      } else {
        next(null, dataset);
      }
    });

  });

  inFile.pipe(outFile);
}

DatasetSchema.methods.csv = function(v) {
  if (v == null) v = this.version;
  return  path.join(config.data, this._id + '-' + v + '.csv');
}

DatasetSchema.methods.targets = function(v1, v2) {
  var diff = this.diff(v1, v2);
  var targets = [];
  var schema = null;
  var headers = null;
  var rowCount = 0;
  var path = '/api/datasets/' + this._id + '.csv';

  for (var i = 0; i < diff.length; i++) {
    var row = diff[i];
    var action = row[0];
    if (action == '@@') {
      header = row;
    } else if (action == '!') {
      schema = row;
    } else {
      rowCount += 1;
      if (action == '+++') {
        targets.push(path + '#row=' + rowCount);
      } else if (action == '+') {
        // todo: handle additional columns
      } else if (action.match(/-+>/)) {
        for (var j = 1; j < row.length; j++) {
          var col = row[j];
          if (col.before && col.after) {
            targets.push(path + '#cell=' + rowCount + ',' + j);
          }
        }
      }
    }
  }

  return targets;
}

DatasetSchema.methods.diff = function(v1, v2) {
  var f1 = this.csv(v1);
  var f2 = this.csv(v2);

  var t1 = new daff.TableView(babyparse.parse(fs.readFileSync(f1, 'utf8')).data);
  var t2 = new daff.TableView(babyparse.parse(fs.readFileSync(f2, 'utf8')).data);

  var alignment = daff.compareTables(t1, t2).align();
  var dataDiff = [];
  var tableDiff = new daff.TableView(dataDiff);

  var flags = new daff.CompareFlags();
  flags.allow_nested_cells = true;
  flags.show_unchanged = true;
  var highlighter = new daff.TableDiff(alignment, flags);
  highlighter.hilite(tableDiff);

  return dataDiff;
}

DatasetSchema.methods.toJsonLd = function() {
  var d = this.toObject();
  d['@context'] = '/api/context';
  d['@id'] = '/api/datasets/' + d._id;
  d.url = '/datasets/' + d._id;
  delete d._id;
  delete d.__v;

  return d;
}

var Dataset = mongoose.model('Dataset', DatasetSchema);

module.exports.User = User;
module.exports.Dataset = Dataset;
module.exports.context = context;
module.exports.mongoose = mongoose;
module.exports.config = config;