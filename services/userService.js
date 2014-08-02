var Q = require('q'),
    logger = require('tracer').console();

var UserService = function(userModel) {
  this.userModel = userModel;
}

UserService.prototype.new = function(twitterId) {
  var deferred = Q.defer();
  var user = new this.userModel({
    twitterId: twitterId,
    votes: []
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

UserService.prototype.findOrCreate = function(twitterId) {
  var deferred = Q.defer();
  this.userModel.find({twitterId: twitterId}, function(error, docs){
    if (docs.length > 0) {
      logger.log('existing user %s', docs[0].twitterId);
      deferred.resolve(docs[0]);
    } else {
      var user = new this.userModel({
        twitterId: twitterId,
        votes: []
      });
      user.save(function(error, item){
        if (error) {
          deferred.reject(error);
        } else {
          logger.log('new user %s', item.twitterId);
          deferred.resolve(item);
        }
      });
    }
  }.bind(this));
  return deferred.promise;
};

exports.UserService = UserService;