var fs = require('fs');
var async = require('async');
var jsonld = require('jsonld');
var request = require('request');
var mongoose = require('mongoose');

var config = JSON.parse(fs.readFileSync('config.json'));

mongoose.connect(config.mongodb);

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
  modified: String
});

DatasetSchema.statics.loadFromUrl = function(url, next) {

	var dataset = new Dataset({
		url: url, 
		metadataUrl: url + "-metadata.json"
	});

	var jsonldContext = {
		title: "http://purl.org/dc/terms/title",
		creator: "http://purl.org/dc/terms/creator",
		modified: "http://purl.org/dc/terms/modified",
		publisher: "http://purl.org/dc/terms/publisher"
	};

	request.get(dataset.metadataUrl, {json: true}, function (error, response, metadata) {
		dataset.metadata = metadata;
		jsonld.compact(metadata, jsonldContext, function(err, compacted) {
			dataset.compactedMetadata = compacted;
			dataset.title = compacted.title;
			dataset.creator = compacted.creator;
			dataset.modified = compacted.modified;
			next(error, dataset);
		});
	});
}

var Dataset = mongoose.model('Dataset', DatasetSchema);

module.exports.User = User;
module.exports.Dataset = Dataset;
module.exports.mongoose = mongoose;