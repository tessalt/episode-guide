var express = require('express'),
    router = express.Router(),
    ShowController = require('./controllers/showController').ShowController,
    Show = require('./schemas/show').Show,
    EpisodeController = require('./controllers/episodeController').EpisodeController,
    Episode = require('./schemas/episode').Episode,
    Tvdb = require('./libs/tvdb.js'),
    Q = require('q'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync("config.json"));


var showController = new ShowController(Show),
    episodeController = new EpisodeController(Episode),
    tvdb = new Tvdb(config.tvdb_key, 'en');

router.get('/', function(req, res){
  res.sendfile('index.html');
});

router.post('/tvdb/search', function(req, res){
  return tvdb.search(req.body.searchString)
    .then(function(response){
      res.json(response);
    })
    .fail(function(error){
      res.send(error);
    });
});

router.get('/api/shows', function(req, res){
  return showController.index()
    .then(function(response){
      res.json(response)
    })
    .fail(function(error){
      res.send(error);
    });
});

router.get('/api/shows/:seriesId', function(req, res){
  return showController.show(req.params.seriesId)
    .then(function(response){
      res.json(response);
    })
    .fail(function(error){
      res.send(error);
    });
});

router.post('/api/shows/new', function(req, res){
  return tvdb.getSeries(req.body.seriesId)
    .then(function(showData){
      return showController.new(showData.id, showData.name)
        .then(function(show){
          return showController.saveEpisodes(show, showData.episodes)
        })
        .then(function(showWithEps){
          return showController.save(showWithEps);
        })
        .then(function(show){
          res.json(show);
        })
        .fail(function(error){
          res.send(error);
        })
    });
});

router.post('/api/vote',  function(req, res){
  if (req.isAuthenticated()) {
    return showController.vote(req.body, req.session.passport.user.id)
      .then(function(){
        res.send('Voted');
      })
      .fail(function(error){
        res.send(error);
      });
  } else {
    res.send('please authenticate');
  }
});

module.exports = router;