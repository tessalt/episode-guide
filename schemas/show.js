var mongoose = require('mongoose');
var Episode = require('./episode').episodeSchema;

var showSchema = new mongoose.Schema({
  name: String,
  seriesId: Number,
  episodes: [Episode]
});

var Show = mongoose.model('Show', showSchema);

exports.Show = Show;