var express = require('express'),
    router = express.Router(),
    ShowService = require('./services/showService').ShowService,
    Show = require('./schemas/show').Show,
    EpisodeService = require('./services/episodeService').EpisodeService,
    Episode = require('./schemas/episode').Episode,
    Tvdb = require('./libs/tvdb.js'),
    Q = require('q');


var showService = new ShowService(Show);
var episodeService = new EpisodeService(Episode);
var tvdb = new Tvdb('00E0199BDA221061', 'en');

router.get('/', function(req, res){
  res.render('index');  
});

router.post('/tvdb/search', function(req, res){
  tvdb.search(req.body.searchString, function(error, response){
    res.render('showsSearch', {shows: response});
  });
});

router.get('/shows', function(req, res){
  showService.index(function(error, response){
    res.render('shows', {shows: response});
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
          showService.save(showWithEps);
        })
        .then(function(){
          res.redirect('/shows');
        })
        .fail(function(error){
          res.send(error);
        })
    });
});

router.get('/shows/:seriesId', function(req, res){
  showService.show(req.params.seriesId, function(err, response){    
    if (!err) {
      res.render('show', {show: response[0]});
    }
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