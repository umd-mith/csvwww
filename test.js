var models = require('./models');
var assert = require('assert');

describe('models', function() {

  describe('Dataset', function() {

    it('loadFromUrl', function(done) {
      var url = "https://umd-mith.github.io/fla-metadata/1316980598.csv";
      var dataset = new models.Dataset.loadFromUrl(url, function(err, dataset) {
        assert.equal(dataset.url, "https://umd-mith.github.io/fla-metadata/1316980598.csv");
        assert.equal(dataset.metadataUrl, "https://umd-mith.github.io/fla-metadata/1316980598.csv-metadata.json");
        assert.equal(dataset.metadata['dc:title'], "Test Subcollection/HTRC Project - Borden");
        assert.equal(dataset.title, "Test Subcollection/HTRC Project - Borden");
        assert.equal(dataset.creator, "sapienza");
        // TODO: test the actual CSV data!
        done();
      });
    });

  });

});
