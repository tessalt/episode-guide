var mongoose = require('mongoose');
var Episode = require('./episode');

var showSchema = new mongoose.Schema({
  name: String,
  seriesId: Number,
  episodes: [Episode]
});

var Show = mongoose.model('Show', showSchema);

module.exports = Show;