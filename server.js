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

var app = express();

var showService = new ShowService(Show);
var episodeService = new EpisodeService(Episode);

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

  request.get(tvdbClient.baseURL + 'GetSeries.php?seriesname=' + req.body.searchString + '&language=' + tvdbClient.lang, function(request, response){
    parseXML(response.body, {
       trim: true,
        normalize: true,
        ignoreAttrs: true,
        explicitArray: false,
        emptyTag: null
    }, function(err, result){
      console.log(result.Data.Series);

      if (result.Data.Series.length) {
        res.render('showsSearch', {shows: result.Data.Series});
      } else {
        res.render('showsSearch', {shows: result.Data});
      }
    })
  })

});

app.get('/shows', function(req, res){
  showService.index(function(error, response){
    res.render('shows', {shows: response});
  });
});

app.post('/shows/new', function(req, res){

  request.get(tvdbClient.baseURL + tvdbClient.key + '/series/' + req.body.seriesId + '/all/en.xml' , function(request, response){
    parseXML(response.body, {
       trim: true,
        normalize: true,
        ignoreAttrs: true,
        explicitArray: false,
        emptyTag: null
    }, function(err, result){

      showService.new(result.Data.Series.id, result.Data.Series.SeriesName, function(error, response){

        // console.log('showid: ' + response);

        for (var i = 0; i < result.Data.Episode.length; i++) {
          var episode = result.Data.Episode[i];

          episodeService.new({
            _series: response,
            episodeId: episode.id,
            name: episode.EpisodeName,
            description: episode.Overview,
            episodeNum: episode.EpisodeNumber,
            seasonNum: episode.SeasonNumber
          }, function(error, epresponse){
            if (error) {

              console.log('episode: ' + error);
            } else {

              console.log('episode: ' + epresponse);
            }
            res.redirect('/shows');
          });
        };


      });

    })
  });

});