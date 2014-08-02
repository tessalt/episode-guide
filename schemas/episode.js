var mongoose = require('mongoose');

var episodeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  score: Number,
  episodeNumber: Number,
  season: Number
});

var Episode = mongoose.model('Episode', episodeSchema);

exports.Episode = Episode;

exports.episodeSchema = episodeSchema;