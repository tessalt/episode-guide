var Q = require('q');

var Controller = function(model) {
  this.model = model;
}

Controller.prototype.save = function(model) {
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

exports.Controller = Controller;