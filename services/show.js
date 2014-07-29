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
    var m = new this.showModel({
      seriesId: seriesId,
      name: name
    });
    m.save(function(error){
      if (error) {
        callback(error, null);
      } else {
        callback(null, m.seriesId);
      }
    });
  } else {
    callback('include series id');
  }
};


exports.ShowService = ShowService;