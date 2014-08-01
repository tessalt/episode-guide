var EpisodeService = function(episodeModel) {
  this.episodeModel = episodeModel;
}

EpisodeService.prototype.new = function(data, callback) {
  var episode = new this.episodeModel({
    name: data.name,
    description: data.description,
    score: 0
  });
  callback(episode);
};

// EpisodeService.prototype.vote = function(data, callback) {
//   console.log(data);
//   this.episodeModel.findById(data.episode_id, function(error, episode){
//     var currentScore = episode.get('score');
//     var newScore = currentScore + parseInt(data.direction);
//     episode.update({score: newScore }, {}, callback(error));
//   });
// };

exports.EpisodeService = EpisodeService;