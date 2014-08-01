var express = require('express'),
    router = express.Router(),
    ShowService = require('./services/showService').ShowService,
    Show = require('./schemas/show').Show,
    EpisodeService = require('./services/episodeService').EpisodeService,
    Episode = require('./schemas/episode').Episode,
    Tvdb = require('./libs/tvdb.js'),
    Q = require('q'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync("config.json"));


var showService = new ShowService(Show),
    episodeService = new EpisodeService(Episode),
    tvdb = new Tvdb(config.tvdb_key, 'en');

router.get('/', function(req, res){
  res.render('index');  
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
  return showService.index()
    .then(function(response){
      res.render('shows', {shows: response})
    })
    .fail(function(error){
      res.send(error);
    });
});

router.get('/shows/:seriesId', function(req, res){
  return showService.show(req.params.seriesId)
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
      return showService.new(showData.id, showData.name)
        .then(function(show){
          return showService.saveEpisodes(show, showData.episodes)
        })
        .then(function(showWithEps){
          return showService.save(showWithEps);
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
  if (req.isAuthenticated()) {
    showService.vote(req.body, function(error, episode){
      if (error) {
        res.send(error);
      } else {
        res.redirect(req.get('referer'));
      }
    })
  } else {
    res.send('please authenticate');
  }
});

module.exports = router;