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

var app = express();

var showlService = new ShowService(Show);

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
      res.render('shows', {shows: result.Data.Series});
    })
  })

});

app.post('/shows', function(req, res){

  request.get(tvdbClient.baseURL + tvdbClient.key + '/series/' + req.body.seriesId + '/all/en.xml' , function(request, response){
    parseXML(response.body, {
       trim: true,
        normalize: true,
        ignoreAttrs: true,
        explicitArray: false,
        emptyTag: null
    }, function(err, result){
      res.render('show', {episodes: result.Data.Episode});
    })
  });

});