var EpisodeController = function(episodeModel) {
  this.episodeModel = episodeModel;
}

EpisodeController.prototype.new = function(data, callback) {
  var episode = new this.episodeModel({
    name: data.name,
    description: data.description,
    score: 0,
    episodeNumber: data.episodeNumber,
    season: data.season
  });
  callback(episode);
};

exports.EpisodeController = EpisodeController;