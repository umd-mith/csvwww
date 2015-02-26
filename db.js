var fs = require('fs');
var mongoose = require('mongoose');
var config = JSON.parse(fs.readFileSync('config.json'));

mongoose.connect(config.mongodb);

module.exports.User = mongoose.model('User', {
  username: String,
  name: String,
  avatar: String
});

