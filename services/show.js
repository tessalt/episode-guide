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
    var show = new this.showModel({
      seriesId: seriesId,
      name: name,
      episodes: []
    });
    callback(show);
  } else {
    callback('include series id');
  }
};

ShowService.prototype.save = function(show, callback) {
  show.save(function(error){
    callback(error);
  })
};

exports.ShowService = ShowService;