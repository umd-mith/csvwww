var fs = require('fs');
var assert = require('assert');
var rimraf = require('rimraf');
var models = require('./models');

// use test database and test data directory for files

models.mongoose.connect("mongodb://localhost/csvhub-test");
models.config.data = "test-data";

// clean up db and filesystem before & after each test

function clean() {
  rimraf.sync("test-data");
  fs.mkdirSync("test-data");
  models.mongoose.connection.db.dropDatabase();
}
afterEach(clean);
beforeEach(clean);

describe('models', function() {

  describe('Dataset', function() {

    it('newFromUrl', function(done) {
      this.timeout(5000);
      var url = "https://umd-mith.github.io/fla-metadata/1316980598.csv";
      var dataset = new models.Dataset.newFromUrl(url, function(err, dataset) {
        assert.equal(dataset.url, "https://umd-mith.github.io/fla-metadata/1316980598.csv");
        assert.equal(dataset.metadataUrl, "https://umd-mith.github.io/fla-metadata/1316980598.csv-metadata.json");
        assert.equal(dataset.metadata['dc:title'], "Test Subcollection/HTRC Project - Borden");
        assert.equal(dataset.title, "Test Subcollection/HTRC Project - Borden");
        assert.equal(dataset.creator, "sapienza");

        assert.equal(dataset.versions.length, 1);
        assert(fs.statSync(dataset.versions[0].csvFilename));
        assert(fs.statSync(dataset.versions[0].csvwFilename));

        // make sure the dataset was saved to mongo
        var id = dataset._id;
        assert(id);
        models.Dataset.findOne({_id: id}, function(err, d) {
          assert(!err);
          assert.equal(d.title, "Test Subcollection/HTRC Project - Borden")
          done();
        });

      });

    });

  });

})