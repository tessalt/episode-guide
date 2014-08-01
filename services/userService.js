var Q = require('q');

var UserService = function(userModel) {
  this.userModel = userModel;
}

UserService.prototype.new = function(twitterId) {
  var deferred = Q.defer();
  var user = new this.userModel({
    twitterId: twitterId
  });
  user.save(function(error){
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(user);
    }
  });
  return deferred.promise;
};

exports.UserService = UserService;