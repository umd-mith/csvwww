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

    it('new from csv', function(done) {
      this.timeout(15000);
      var url = "https://umd-mith.github.io/fla-metadata/1316980598.csv";
      models.Dataset.newFromUrl(url, function(err, dataset) {
        assert.equal(err, null);
        assert.equal(dataset.derivedFrom, "https://umd-mith.github.io/fla-metadata/1316980598.csv-metadata.json");
        assert.equal(dataset.distribution.derivedFrom, "https://umd-mith.github.io/fla-metadata/1316980598.csv");
        assert(dataset.distribution.downloadURL);
        assert.equal(dataset.title, "Test Subcollection/HTRC Project - Borden");
        assert.equal(dataset.creator, "sapienza");
        assert.equal(dataset.version, 0);
        assert(fs.statSync(dataset.latestCsv()));

        // make sure the dataset was saved to mongo
        var id = dataset._id;
        assert(id);
        models.Dataset.findById(id, function(err, d) {
          assert(!err);
          assert.equal(d.title, "Test Subcollection/HTRC Project - Borden")
          done();
        });

        var j = dataset.toJsonLd();
        assert(j['@context']);
        assert(j['@id']);
        assert.equal(j.title, "Test Subcollection/HTRC Project - Borden");
      });

    });

    it('new from csv without csvw', function(done) {
      this.timeout(15000);

      var url = 'https://data.ok.gov/api/views/jk65-dhyi/rows.csv?accessType=DOWNLOAD';
      models.Dataset.newFromUrl(url, function(err, dataset) {
        assert.equal(err, null);
        assert(dataset.title);
        assert.equal(dataset.derivedFrom, null);
        assert.equal(dataset.distribution.derivedFrom, url);
        done();
      });
    });

    it('new from missing csv', function(done) {
      this.timeout(15000);

      var url = 'http://example.com/no-csv-here';
      models.Dataset.newFromUrl(url, function(err, dataset) {
        assert(err); 
        done();
      });
    });

    it('diff', function(done) {
      var d = new models.Dataset();

      d.version = 0;
      fs.writeFileSync(d.latestCsv(), 'col1,col2,col3\n1,2,3\n4,5,6\n7,8,9');
      d.save();

      d.version = 1;
      fs.writeFileSync(d.latestCsv(), 'col1,col2,col3\n1,2,3\n4,5,6\n1,8,9');
      d.save();

      var diff = d.diff(0, 1);
      assert.deepEqual(diff, [ 
        ['@@', 'col1', 'col2', 'col3'], 
        ['...', '...', '...', '...'],
        [ '', '1', '2', '3' ],
        ['', '4', '5', '6'],
        ['->', {before: '7', after: '1'}, '8', '9'],
        ['', '', undefined, undefined]
      ]);
      done();
    });

  });

});