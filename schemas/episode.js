var mongoose = require('mongoose');

var episodeSchema = new mongoose.Schema({
  name: String,
  description: String
});

var Episode = mongoose.model('Episode', episodeSchema);

exports.Episode = Episode;

exports.episodeSchema = episodeSchema;