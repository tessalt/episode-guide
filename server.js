// Dependencies
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    logfmt = require("logfmt"),
    logger = require('tracer').console(),
    mongoose = require('mongoose'),
    request = require('request'),
    session = require('express-session'),
    parseXML = require("xml2js").parseString,
    jade = require('jade'),
    cookieParser = require('cookie-parser'),
    Q = require('q'),
    passport = require('passport');

var config = JSON.parse(fs.readFileSync("config.json")),
  User = require('./schemas/user').User,
  UserController = require('./controllers/UserController').UserController;

var app = express();

app.set('view engine', 'jade');
app.use(logfmt.requestLogger());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// custom modules
var routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/show');

var TwitterStrategy = require('passport-twitter').Strategy;
var userController = new UserController(User);

if (process.env.NODE_ENV !== 'debug') {
  passport.use(
    new TwitterStrategy({
      consumerKey: config.twitter_key,
      consumerSecret: config.twitter_secret,
      callbackURL: "http://127.0.0.1:4000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      return userController.findOrCreate(profile.id)
        .then(function(user){
          return done(null, profile);
        });
    }
  ));
} else {
  app.use(function(req, res, next){
    return userController.findOrCreate(config.superuser_id)
      .then(function(resp){
        req.session.passport = {
          user: {
            id: resp.twitterId
          }
        };
        req.session.debug = true;
        req.isAuthenticated = function(){
          return true;
        };
        next();
      });
  })
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

app.use('/', routes);


var port = Number(process.env.PORT || 4000);

var server = app.listen(port,  function() {
  console.dir("server listening on port " + server.address().port);
});

module.exports = app;