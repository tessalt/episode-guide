var Q = require('q'),
    mongoose = require('mongoose'),
    EpisodeService = require('./episodeService').EpisodeService,
    Episode = require('../schemas/episode').Episode,
    User = require('../schemas/user').User,
    logger = require('tracer').console();

var episodeService = new EpisodeService(Episode);

var ShowService = function(showlModel) {
  this.showModel = showlModel;
}

ShowService.prototype.index = function(callback) {
  var deferred = Q.defer();
  this.showModel.find(function(error, results){
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(results);
    }
  });
  return deferred.promise;
};

ShowService.prototype.new = function(seriesId, name) {
  var deferred = Q.defer();
  if (typeof seriesId !== "undefined") {

    this.showModel.find( {seriesId: seriesId}, function(err, docs){
      if (docs.length) {
        deferred.reject("that series has already been added");
      } else {
        var show = new this.showModel({
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

ShowService.prototype.show = function(seriesId, callback) {
  var deferred = Q.defer();
  this.showModel.find( {seriesId: seriesId}, function(error, docs){
    if (docs.length) {
      deferred.resolve(docs[0]);
    } else {
      deferred.reject(error);
    }
  });
  return deferred.promise;
};

ShowService.prototype.save = function(show) {
  var deferred = Q.defer()
  show.save(function(error){
    if (error) {
      deferred.reject(error);
    } else {
      // console.log(show);
      deferred.resolve(show);
    }
  });
  return deferred.promise;
};

ShowService.prototype.saveEpisodes = function(show, rawEps) {
  var deferred = Q.defer();
  var episodes = [];
  var promises = [];

  rawEps.forEach(function (ep, i, arr){
    var dfd = Q.defer();
    episodeService.new({
      name: ep.EpisodeName,
      description: ep.Overview,
      season: ep.SeasonNumber,
      episodeNumber: ep.EpisodeNumber,
      score: 0
    }, function(episode){
      show.episodes.push(episode);
      dfd.resolve(episode);
    });
    promises.push(dfd.promise);
  });

  Q.all(promises).then(function(){
    show.save(function(error){
      if (!error) {
        deferred.resolve(show);
      } else
        deferred.reject(error);
    });
  });

  return deferred.promise;
}


ShowService.prototype.vote = function(data, userId) {
  var _this = this;
  var deferred = Q.defer();

  var findShow = this.showModel.findById(data.show_id).exec();
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
            user.save()
          })
          .then(function(){
            deferred.resolve()
          })
          .fail(function(error){
            deferred.reject(error);
          })
      }
    })
  })


  // findShowById(data.show_id)
  //   .then(function(show){
  //     return findUser({twitterId: userId})
  //     .then(function(user){
  //       console.log('userId ' + userId )
  //       console.log(user);
  //       var ep = show.episodes.id(data.episode_id);
  //       if (user.votes.indexOf(ep._id)) {
  //         deferred.reject('you have already voted');
  //       } else {
  //         var currentScore = ep.get('score');
  //         ep.score = currentScore + parseInt(data.direction);
  //         return _this.save(show)
  //           .then(function(show){
  //             user.votes.push(ep._id);
  //             user.save(function(error){
  //               if (error) {
  //                 deferred.reject(error)
  //               } else {
  //                 deferred.resolve(show);
  //               }
  //             })
  //           })
  //           .fail(function(error){
  //             deferred.reject(error);
  //           });
  //       }
  //     })
  //     .fail(function(error){
  //       deferred.reject(error);
  //     })
  //   })
  //   .fail(function(error){
  //     deferred.reject(docs);
  //   });

  return deferred.promise;
}

exports.ShowService = ShowService;