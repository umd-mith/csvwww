var csvw = require('./csvw');
var assert = require('assert');

describe('csvw', function() {

	describe('Dataset', function() {

		it('new', function() {
			var dataset = new csvw.Dataset("https://umd-mith.github.io/fla-metadata/1316980598.csv");
			assert.equal(dataset.url, "https://umd-mith.github.io/fla-metadata/1316980598.csv");
			assert.equal(dataset.metadataUrl, "https://umd-mith.github.io/fla-metadata/1316980598.csv-metadata.json");
		});

		it('should load metadata', function(done) {
			var dataset = new csvw.Dataset("https://umd-mith.github.io/fla-metadata/1316980598.csv");
			dataset.loadMetadata(function(err, metadata) {
			  assert.equal(metadata['dc:title'], "Test Subcollection/HTRC Project - Borden");
			  assert.equal(dataset.title, "Test Subcollection/HTRC Project - Borden");
			  assert.equal(dataset.creator, "sapienza");
			  done();
			});
		});

		it('should save csv', function(done) {
			var dataset = new csvw.Dataset("https://umd-mith.github.io/fla-metadata/1316980598.csv");
			done();
		});

	});

});