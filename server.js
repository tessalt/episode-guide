// Dependencies
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    logfmt = require("logfmt");

// custom modules
var ModelService = require('./services/model').ModelService,
    Model = require('./schemas/model');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(logfmt.requestLogger());

var port = Number(process.env.PORT || 3000);
var server = app.listen(port,  function() {
  console.dir("server listening on port " + server.address().port);
});

mongoose.connect('mongodb://localhost:27017/model');

var modelService = new ModelService(Model);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/models', function(req, res){
  modelService.index(function(response){
    res.json(response);
  });
});

app.post('/models', function(req, res){
  modelService.new(req.body.name, function(response){
    res.send(response);
  });
});

app.get('/models/:id', function(req, res){
  modelService.show(req.params.id, function(response){
    res.send(response);
  });
});

app.put('/models/:id', function(req, res){
  modelService.update(req.params.id, req.body.name, function(response){
    res.send(response);
  });
});

app.delete('/models/:id', function(req, res){
  modelService.destroy(req.params.id, function(response){
    res.send(response);
  });
});