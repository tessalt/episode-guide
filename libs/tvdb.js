var request = require('request'),
    parseXML = require("xml2js").parseString;

var Tvdb = function(key, lang) {
  this.key = key;
  this.lang = lang;
  this.baseURL = 'http://www.thetvdb.com/api/';
};

Tvdb.prototype.search = function(string, callback) {
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
        callback(error, result.Data.Series);
      } else if (result.Data) {
        callback(error, result.Data);
      } else {
        callback(error, null);
      }
    });
  });
};

module.exports = Tvdb;