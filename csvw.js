var async = require('async');
var jsonld = require('jsonld');
var request = require('request');

var context = {
	title: "http://purl.org/dc/terms/title",
	creator: "http://purl.org/dc/terms/creator",
	modified: "http://purl.org/dc/modified",
	publisher: "http://pur.org/dc/publisher"
};

function Dataset(url) {
  this.url = url;
  this.metadataUrl =  url + "-metadata.json";
}

Dataset.prototype.loadMetadata = function(next) {
	var that = this;
	request.get(this.metadataUrl, {json: true}, function (error, response, data) {
		that.metadata = data;
		jsonld.compact(data, context, function(err, compacted) {
			that.compactedMetadata = compacted;
			that.title = compacted.title;
			next(error, data);
		});
	});
}

module.exports.Dataset = Dataset;
