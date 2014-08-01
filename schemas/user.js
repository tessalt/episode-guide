var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  twitterId: Number,
  votes: [mongoose.Schema.Types.ObjectId]
});

var User = mongoose.model('User', userSchema);

exports.User = User;