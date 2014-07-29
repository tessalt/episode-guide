var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var showSchema = new mongoose.Schema({
  name: String,
  seriesId: Number,
  episodes: [{ type: Schema.Types.ObjectId, ref: 'Episode' }]
});

var Show = mongoose.model('Show', showSchema);

module.exports = Show;