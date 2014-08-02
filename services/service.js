var Q = require('q');

var Service = function(model) {
  this.model = model;
}

Service.prototype.save = function(model) {
  var deferred = Q.defer()
  model.save(function(error){
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(model);
    }
  });
  return deferred.promise;
};

exports.Service = Service;