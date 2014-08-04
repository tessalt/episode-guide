App = Ember.Application.create({});

App.Router.map(function(){
  this.resource('shows');
  this.resource('shows.new', {path: 'shows/new'});
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

App.Availableshows = {
  findByQuery: function(query) {
    return $.getJSON('/tvdb/search/' + query).then(function(shows){
      console.log(shows);
      return shows;
    })
  }
}

App.AvailableshowsRoute = Ember.Route.extend({
  model: function(params) {
    return params;
  },
  setupController: function(controller, model) {
    var query = model.query;
    $.getJSON('/tvdb/search/' + query).then(function(shows){
      controller.set('model', shows);
    });
  }
});

App.ShowsNewController = Ember.Controller.extend({
  searchString: '',
  actions: {
    searchSubmit: function(value) {
      var query = this.get('searchString');
      this.transitionToRoute('availableshows', {query: query});
    }.observes('searchString')
  }
});