var fs = require('fs');
var mongoose = require('mongoose');
var config = JSON.parse(fs.readFileSync('config.json'));

mongoose.connect(config.mongodb);

User = mongoose.model('User', {
  username: String,
  name: String,
  avatar: String
});

Dataset = mongoose.model('Dataset', {
  title: String,
  creator: String,
});

module.exports.User = User;
module.exports.Dataset = Dataset;
module.exports.mongoose = mongoose;
