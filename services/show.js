var ShowService = function(showlModel) {
  this.showModel = showlModel;
}

ShowService.prototype.index = function(callback) {
  this.showModel.find(function(error, results){
    if (error) {
      console.log(error, null);
    } else {
      callback(null, results);
    }
  });
};

ShowService.prototype.new = function(seriesId, name, callback) {
  var _this = this;
  if (typeof seriesId !== "undefined") {

    this.showModel.find( {seriesId: seriesId}, function(err, docs){
      if (docs.length) {
        callback("that series has already been added", null);
      } else {
        var show = new _this.showModel({
          seriesId: seriesId,
          name: name,
          episodes: []
        });
        callback(null, show);
      }
    });
  } else {
    callback('include series id', null);
  }
};

ShowService.prototype.show = function(seriesId, callback) {
  this.showModel.find( {seriesId: seriesId}, function(err, docs){
    if (docs.length) {
      callback(null, docs);
    } else {
      callback(err, null);
    }
  });
};

ShowService.prototype.save = function(show, callback) {
  show.save(function(error){
    callback(error);
  })
};

ShowService.prototype.vote = function(data, callback) {
  this.showModel.findById(data.show_id, function(error, show){
    var ep = show.episodes.id(data.episode_id);
    var currentScore = ep.get('score');
    var newScore = currentScore + parseInt(data.direction);
    ep.score = newScore;
    show.save(callback(error, ep));
  });
}

exports.ShowService = ShowService;