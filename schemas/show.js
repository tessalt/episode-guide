var mongoose = require('mongoose');

var showSchema = new mongoose.Schema({
  name: String,
  seriesId: Number
});

var Show = mongoose.model('Show', showSchema);

module.exports = Show;