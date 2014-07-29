var EpisodeService = function(episodeModel) {
  this.episodeModel = episodeModel;
}

EpisodeService.prototype.new = function(data, callback) {
  var seriesId = data._series;
    var episode = new this.episodeModel({
      _series: seriesId,
      epId: data.epId,
      name: data.name,
      description: data.description,
      episodeNum: data.episodeNum,
      seasonNum: data.seasonNum
    });
    episode.save(function(error){
      if (error) {
        callback(error, null);
      } else {
        callback(null, episode);
      }
    });
};


exports.EpisodeService = EpisodeService;