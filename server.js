// Dependencies
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    logfmt = require("logfmt"),
    mongoose = require('mongoose'),
    request = require('request'),
    parseXML = require("xml2js").parseString,
    jade = require('jade'),
    Q = require('q');

var tvdbClient = {
  baseURL: 'http://www.thetvdb.com/api/',
  key: '00E0199BDA221061',
  lang: 'en'
};

// custom modules
var ShowService = require('./services/show').ShowService,
    Show = require('./schemas/show').Show;

var EpisodeService = require('./services/episode').EpisodeService,
    Episode = require('./schemas/episode').Episode;

var Tvdb = require('./libs/tvdb.js');

var app = express();

var showService = new ShowService(Show);
var episodeService = new EpisodeService(Episode);
var tvdb = new Tvdb('00E0199BDA221061', 'en');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(logfmt.requestLogger());
app.set('view engine', 'jade');

mongoose.connect('mongodb://localhost:27017/show');

var port = Number(process.env.PORT || 4000);

var server = app.listen(port,  function() {
  console.dir("server listening on port " + server.address().port);
});

app.get('/', function(req, res){
  res.render('index');
});

app.post('/tvdb/search', function(req, res){

  tvdb.search(req.body.searchString, function(error, response){
    res.render('showsSearch', {shows: response});
  });

});

app.get('/shows', function(req, res){
  showService.index(function(error, response){
    res.render('shows', {shows: response});
  });
});

app.post('/shows/new', function(req, res){

  tvdb.getSeries(req.body.seriesId, function(error, response){

    showService.new(response.Series.id, response.Series.SeriesName, function(show){

      var episodes = [];
      var promises = [];

      for (var i = 0; i < response.Episode.length; i++) {
        var dfd = Q.defer()
        var episode = response.Episode[i];
        episodeService.new({
          name: episode.EpisodeName,
          description: episode.Overview
        }, function(epServiceResponse) {
          console.log(typeof epServiceResponse)
          show.episodes.push(epServiceResponse);
          dfd.resolve(epServiceResponse);
        });
        promises.push(dfd.promise);
      }

      Q.all(promises).then(function(promiseData){

        show.save(function(error){
          res.redirect('/shows');
          if (error) {
            console.log(error);
          }
        });

      });

    });

  });

});