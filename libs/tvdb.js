var request = require('request'),
    parseXML = require("xml2js").parseString,
    Q = require('q');

var Tvdb = function(key, lang) {
  this.key = key;
  this.lang = lang;
  this.baseURL = 'http://www.thetvdb.com/api/';
};

Tvdb.prototype.search = function(string, callback) {
  var deferred = Q.defer();
  var url = this.baseURL + 'GetSeries.php?seriesname=' + string + '&language=' + this.lang;
  request.get(url, function(err, response){
    parseXML(response.body, {
      trim: true,
      normalize: true,
      ignoreAttrs: true,
      explicitArray: false,
      emptyTag: null
    }, function(error, result){
      if (result.Data.Series.length) {
        deferred.resolve(result.Data.Series);
      } else if (result.Data) {
        deferred.resolve(result.Data);
      } else {
        deferred.reject(error);
      }
    });
  });
  return deferred.promise;
};

Tvdb.prototype.getSeries = function(seriesId, callback) {
  var deferred = Q.defer();
  var url = this.baseURL + this.key + '/series/' + seriesId + '/all/en.xml';
  request.get(url, function(err, response){
    parseXML(response.body, {
      trim: true,
      normalize: true,
      ignoreAttrs: true,
      explicitArray: false,
      emptyTag: null
    }, function(error, result){
      if (result) {
        deferred.resolve({
          id: result.Data.Series.id, 
          name: result.Data.Series.SeriesName, 
          episodes: result.Data.Episode
        });
      } else {
        deferred.reject(error);
      }
    });
  });
  return deferred.promise;
};

module.exports = Tvdb;

