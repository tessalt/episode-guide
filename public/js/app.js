App = Ember.Application.create({});

App.Router.map(function(){
  this.resource('shows', function(){
    this.resource('show', {path: ':seriesId'});
  });
});

App.ShowsRoute = Ember.Route.extend({
  model: function() {
    return $.getJSON('/api/shows').then(function(shows){
      return shows;
    });
  }
});

App.ShowRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON('/api/shows/' + params.seriesId).then(function(show){
      return show;
    });
  }
});