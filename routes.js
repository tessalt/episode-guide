var express = require('express'),
    router = express.Router(),
    ShowController = require('./services/showController').ShowController,
    Show = require('./schemas/show').Show,
    EpisodeController = require('./services/episodeController').EpisodeController,
    Episode = require('./schemas/episode').Episode,
    Tvdb = require('./libs/tvdb.js'),
    Q = require('q'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync("config.json"));


var showController = new ShowController(Show),
    episodeController = new EpisodeController(Episode),
    tvdb = new Tvdb(config.tvdb_key, 'en');

router.get('/', function(req, res){
  return showController.index()
  .then(function(response){
    res.render('index', {shows: response})
  })
  .fail(function(error){
    res.send(error);
  });
});

router.post('/tvdb/search', function(req, res){
  return tvdb.search(req.body.searchString)
    .then(function(response){
      res.render('showsSearch', {shows: response});
    })
    .fail(function(error){
      res.send(error);
    });
});

router.get('/shows', function(req, res){
  return showController.index()
    .then(function(response){
      res.render('shows', {shows: response})
    })
    .fail(function(error){
      res.send(error);
    });
});

router.get('/shows/:seriesId', function(req, res){
  return showController.show(req.params.seriesId)
    .then(function(response){
      res.render('show', {show: response});
    })
    .fail(function(error){
      res.send(error);
    });
});

router.post('/shows/new', function(req, res){
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
          res.redirect('/shows/' + show.seriesId);
        })
        .fail(function(error){
          res.send('error: ' + error);
        })
    });
});

router.post('/vote',  function(req, res){
  // console.dir(req.session.passport.user.id);
  if (req.isAuthenticated()) {
    return showController.vote(req.body, req.session.passport.user.id)
      .then(function(){
        res.redirect(req.get('referer'));
      })
      .fail(function(error){
        res.send(error);
      });
  } else {
    res.send('please authenticate');
  }
});

module.exports = router;