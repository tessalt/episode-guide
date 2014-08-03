App = Ember.Application.create({});

App.Router.map(function(){
  this.resource('shows');
  this.resource('show', {path: 'shows/:seriesId'});
  this.resource('availableshows', {path: 'availableshows/:query'});
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

App.AvailableshowsRoute = Ember.Route.extend({
  model: function(params) {
  console.log(params.query);
    return $.getJSON('/tvdb/search/' + params.query).then(function(results){
      return results;
    });
  }
});

App.ApplicationController = Ember.Controller.extend({
  search: '',
  actions: {
    query: function() {
      var query = this.get('search');
      this.transitionToRoute('availableshows', query);
    }
  }
});