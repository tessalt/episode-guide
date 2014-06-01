var mongoose = require('mongoose');

var modelSchema = new mongoose.Schema({
  name: String
});

var Model = mongoose.model('Model', modelSchema);

module.exports = Model;