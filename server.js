// Dependencies
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    logfmt = require("logfmt"),
    mongoose = require('mongoose'),
    request = require('request'),
    parseXML = require("xml2js").parseString,
    jade = require('jade');

var tvdbClient = {
  baseURL: 'http://www.thetvdb.com/api/',
  key: '00E0199BDA221061',
  lang: 'en'
};

// custom modules
var ShowService = require('./services/show').ShowService,
    Show = require('./schemas/show');

var EpisodeService = require('./services/episode').EpisodeService,
    Episode = require('./schemas/episode');

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
    console.log(response);
  });

});