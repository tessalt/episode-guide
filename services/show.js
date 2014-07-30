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
  if (typeof seriesId !== "undefined") {

    this.showModel.find( {seriesId: seriesId}, function(err, docs){
      if (docs) {
        callback("that series has already been added", null);
      } else {
        var show = new this.showModel({
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

ShowService.prototype.save = function(show, callback) {
  show.save(function(error){
    callback(error);
  })
};

exports.ShowService = ShowService;