var mongoose = require('mongoose');

var episodeSchema = new mongoose.Schema({
  _series : { type: mongoose.Schema.Types.ObjectId, ref: 'Show' },
  epId: Number,
  name: String,
  description: String,
  episodeNum: Number,
  seasonNum: Number
});

var Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;