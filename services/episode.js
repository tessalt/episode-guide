var EpisodeService = function(episodeModel) {
  this.episodeModel = episodeModel;
}

EpisodeService.prototype.new = function(data, callback) {
  var episode = new this.episodeModel({
    name: data.name,
    description: data.description
  });
  callback(episode);
};


exports.EpisodeService = EpisodeService;