var Q = require('q'),
    mongoose = require('mongoose'),
    Controller = require('./controller').Controller,
    EpisodeController = require('./episodeController').EpisodeController,
    Episode = require('../schemas/episode').Episode,
    User = require('../schemas/user').User,
    logger = require('tracer').console();

var episodeController = new EpisodeController(Episode);

var ShowController = function(model) {
  Controller.call(this, model);
}

ShowController.prototype = new Controller();

ShowController.prototype.index = function(callback) {
  var deferred = Q.defer();
  this.model.find(function(error, results){
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(results);
    }
  });
  return deferred.promise;
};

ShowController.prototype.new = function(seriesId, name) {
  var deferred = Q.defer();
  if (typeof seriesId !== "undefined") {

    this.model.find( {seriesId: seriesId}, function(err, docs){
      if (docs.length) {
        deferred.reject("that series has already been added");
      } else {
        var show = new this.model({
          seriesId: seriesId,
          name: name,
          episodes: []
        });
        deferred.resolve(show);
      }
    }.bind(this));
  } else {
    deferred.reject('include series id');
  }

  return deferred.promise;
};

ShowController.prototype.show = function(seriesId, callback) {
  var deferred = Q.defer();
  this.model.find( {seriesId: seriesId}, function(error, docs){
    if (docs.length) {
      deferred.resolve(docs[0]);
    } else {
      deferred.reject(error);
    }
  });
  return deferred.promise;
};

ShowController.prototype.saveEpisodes = function(show, rawEps) {
  var deferred = Q.defer();

  rawEps.forEach(function (ep, i, arr){
    episodeController.new({
      name: ep.EpisodeName,
      description: ep.Overview,
      season: ep.SeasonNumber,
      episodeNumber: ep.EpisodeNumber,
      score: 0
    }, function(episode){
      show.episodes.push(episode);
    });
  });

  show.save(function(error){
    if (!error) {
      deferred.resolve(show);
    } else
      deferred.reject(error);
  });

  return deferred.promise;
}

ShowController.prototype.vote = function(data, userId) {
  var _this = this;
  var deferred = Q.defer();

  var findShow = this.model.findById(data.show_id).exec();
  var findUser = User.find({twitterId: parseInt(userId)}).exec();

  findShow.then(function(show){
    var episode = show.episodes.id(data.episode_id);
    findUser.then(function(users){
      var user = users[0];
      if (user.votes.indexOf(episode._id) > 0) {
        deferred.reject('you\'ve already voted for this episode');
      } else {
        var currentScore = episode.get('score');
        episode.score = currentScore + parseFloat(data.direction);

        return _this.save(show)
          .then(function(item){
            user.votes.push(episode._id);
            _this.save(user);
          })
          .then(function(one){
            console.log('things?');
            deferred.resolve()
          })
          .fail(function(error){
            deferred.reject(error);
          })
      }
    })
  })

  return deferred.promise;
}

exports.ShowController = ShowController;