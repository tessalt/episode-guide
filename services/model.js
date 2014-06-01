var ModelService = function(modelModel) {
  this.modelModel = modelModel;
}

ModelService.prototype.index = function(callback) {
  this.modelModel.find(function(error, results){
    if (error) {
      console.log('error');
    } else {
      callback(results);
    }
  });
};

ModelService.prototype.new = function(name, callback) {
  if (typeof name !== "undefined") {
    var m = new this.modelModel({
      name: name
    });
    m.save(function(error){
      if (error) {
        callback(error);
      } else {
        callback(m.id);
      }
    });
  } else {
    callback('include name');
  }
};

ModelService.prototype.show = function(id, callback) {
  this.modelModel.findById(id, function(error, result){
    if (error) {
      callback(error);
    } else {
      callback(result);
    }
  });
};

ModelService.prototype.destroy = function(id, callback) {
  this.modelModel.findById(id).remove(function(error){
    if (error) {
      callback(error);
    } else {
      callback('deleted');
    }
  });
};

ModelService.prototype.update = function(id, name, callback) {
  this.modelModel.findByIdAndUpdate(id, {name: name}, function(error){
    if (error) {
      callback(error);
    } else {
      callback('updated');
    }
  });
};

exports.ModelService = ModelService;