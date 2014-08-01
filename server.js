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
    Q = require('q'),
    passport = require('passport')

var config = JSON.parse(fs.readFileSync("config.json"));

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

app.use('/', routes);


mongoose.connect('mongodb://localhost:27017/show');

var TwitterStrategy = require('passport-twitter').Strategy;

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

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

var port = Number(process.env.PORT || 4000);

var server = app.listen(port,  function() {
  console.dir("server listening on port " + server.address().port);
});

module.exports = app;