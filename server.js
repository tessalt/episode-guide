// Dependencies
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    logfmt = require("logfmt"),
    mongoose = require('mongoose'),
    request = require('request'),
    session = require('express-session'),
    parseXML = require("xml2js").parseString,
    jade = require('jade'),
    cookieParser = require('cookie-parser'),
    Q = require('q');

var config = JSON.parse(fs.readFileSync("config.json"));

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;


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
app.set('view engine', 'jade');


app.use(logfmt.requestLogger());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser());
app.use(session(
  { secret: 'keyboard cat' }
));
app.use(passport.initialize());
app.use(passport.session());


passport.use(
  new TwitterStrategy({
    consumerKey: config.twitter_key,
    consumerSecret: config.twitter_secret,
    callbackURL: "http://127.0.0.1:4000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile.id);
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

mongoose.connect('mongodb://localhost:27017/show');

var port = Number(process.env.PORT || 4000);

var server = app.listen(port,  function() {
  console.dir("server listening on port " + server.address().port);
});

app.get('/', function(req, res){
  res.render('index');  
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

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

    showService.new(response.Series.id, response.Series.SeriesName, function(error, show){

      if (!error){
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
      } else {
        res.send(error);
      }

    });

  });

});

app.get('/shows/:seriesId', function(req, res){
  showService.show(req.params.seriesId, function(err, response){
    if (!err) {
      res.render('show', {show: response[0]});
    }
  });
});

app.post('/vote',  function(req, res){
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